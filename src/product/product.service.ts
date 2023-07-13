import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './productSchema';
import { Model } from 'mongoose';
import { CreateProduct, EditProduct } from './dto';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk'
import {v4 as uuid} from 'uuid'
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis'

@Injectable()
export class ProductService {

    private readonly redis: Redis

    constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly configService: ConfigService, private readonly redisService: RedisService){
        this.redis = this.redisService.getClient()
    }

    bucketName = this.configService.get('AWS_BUCKET_NAME');
    s3 = new S3({
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    });

    async createProduct(userId: string, filename: string, dataBuffer: Buffer, dto: CreateProduct){
  
        const uploadedFile = await this.s3.upload({
            Bucket: this.bucketName,
            Body: dataBuffer,
            Key: `${filename}`,
        }).promise()

        const newProduct = new this.productModel({
            productName: dto.productName,
            price: dto.price,
            creator: userId,
            photo: uploadedFile.Location
        })

        await newProduct.save()
        return {message: "Product created successfully", newProduct}
    }

    async deleteProduct(userId: any, productId: string){
        const product = await this.productModel.findById({_id: productId})
        
        if(!product){
            throw new NotFoundException({ status: "false", message: "Product does not exists"})
        }
        if(product.creator !== userId){
            throw new ForbiddenException({ status: "false", message: "Access to resource denied"})
        }
        const oldFileKey = product.photo?.split("/").pop();
        const deletedFile = await this.s3.deleteObject({
            Bucket: this.bucketName,
            Key: oldFileKey
        }).promise()

        await product.deleteOne()
        return {message: "Product deleted successfully", deletedFile}
    }

    async getAllProducts(userId: any){
        const cachedData = await this.redis.get('products')
        if(cachedData){
            return JSON.parse(cachedData)
        }
        const products = await this.productModel.find({creator: userId})
        await this.redis.setex('products', 20, JSON.stringify(products))
        return products
    }

    async getProductById(userId: any, productId: string){
        const cachedData = await this.redis.get('product')
        if(cachedData){
            return JSON.parse(cachedData)
        }
        const product = await this.productModel.find({_id: productId, creator: userId})
        await this.redis.setex('product', 20, JSON.stringify(product))
        return product
    }

    async editProduct(userId: any, productId: string, dto: EditProduct, filename: string, dataBuffer: Buffer){
        const product = await this.productModel.findById({_id: productId})
        if(!product){
            throw new NotFoundException({ status: "false", message: "Product does not exists"})
        }
        
    }
}
