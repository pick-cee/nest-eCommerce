import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './paymentSchema';
import { User, UserSchema } from '../user/userSchema';
import { Product, ProductSchema } from '../product/productSchema';

@Module({
  imports: [MongooseModule.forFeature([{name: Payment.name, schema: PaymentSchema}, {name: User.name, schema: UserSchema},
    {name: Product.name, schema: ProductSchema}
  ])],  
  providers: [PaymentService],
  controllers: [PaymentController]
})
export class PaymentModule {}
