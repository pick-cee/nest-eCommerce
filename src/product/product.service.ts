import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './productSchema';
import { Model } from 'mongoose';

@Injectable()
export class ProductService {
    constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>){}

    async createProduct(){
        
    }
}
