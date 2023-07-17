import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { Product } from "src/product/productSchema";
import { User } from "src/user/userSchema";


export type PaymentDocument = HydratedDocument<Payment>

@Schema({timestamps: true})
export class Payment{
    @Prop({required: true})
    referenceId: string

    @Prop({required: true})
    price: string

    @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: Product.name})
    productId: string

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: User.name})
    userId: User

    @Prop({required: false})
    transactionStatus: boolean
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);