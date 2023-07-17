import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { User } from "src/user/userSchema";


export type ProductDocument = HydratedDocument<Product>

@Schema({timestamps: true})
export class Product{
    @Prop({required: true})
    productName: string

    @Prop({required: true})
    price: number

    @Prop({required: true})
    photo: string

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: User.name})
    creator: User
}

export const ProductSchema = SchemaFactory.createForClass(Product);