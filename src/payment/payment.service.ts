import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './paymentSchema';
import { User, UserDocument } from '../user/userSchema';
import { Product, ProductDocument } from '../product/productSchema';
import { ConfigService } from '@nestjs/config';
import { InjectPaystack } from 'nestjs-paystack';
import { Paystack } from 'paystack-sdk';

@Injectable()
export class PaymentService {
    constructor(@InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>, 
    @InjectModel(User.name) private userModel: Model<UserDocument>, 
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly configServcie: ConfigService,
    @InjectPaystack() private readonly paystackClient: Paystack
    ){}

    async makePayment(userId: any, productId: string): Promise<any>{
        const user = await this.userModel.findById({_id: userId})
        const product = await this.productModel.findById({_id: productId})
        if(!user){
            throw new NotFoundException('User not found')
        }
        if(!product){
            throw new NotFoundException('Product not found')
        }
        const price = (product.price * 100).toString()
        const init = await this.paystackClient.transaction.initialize({
            amount: price,
            email: user.email,
            reference: Math.random().toString()
        })

        const verify = await this.paystackClient.transaction.verify(init.data.reference)
        if(verify.status == true){
            const newPayment = new this.paymentModel({
                price: product.price,
                referenceId: init.data.reference,
                productId: product._id,
                userId: user._id,
                transactionStatus: init.status
            })
            await newPayment.save()
            return {message: "Payment made", PaymentDetails: newPayment, init}
        }
    }

    async verifyPayment(paymentId: any){
        const payment = await this.paymentModel.findById({_id: paymentId})
        const verify = await this.paystackClient.transaction.verify(payment.referenceId)
        if(verify.status == true){
            return {message: 'Payment verification successful'}
        }
    }

    async getPaymentHistory(userId: any){
        const user = await this.userModel.findById({_id: userId})
        const payment = await this.paymentModel.find({userId: user._id})
        if(!payment){
            throw new NotFoundException("You have no payment records")
        }
        return {paymentHistory: payment}
    }

    async getSucessfulTransactions(userId: any){
        const user = await this.userModel.findById({_id: userId})
        const payment = await this.paymentModel.find({userId: user, transactionStatus: true})
        return {payment}
    }
}
