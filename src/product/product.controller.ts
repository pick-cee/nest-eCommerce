import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Patch, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { GetUser } from '../auth/decorator';
import { CreateProduct, EditProduct } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from '../auth/guard';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './productSchema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

@UseGuards(JwtGuard)
@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService, @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly configService: ConfigService,){}

    bucketName = this.configService.get('AWS_BUCKET_NAME');
    s3 = new S3({
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
    });

    @HttpCode(HttpStatus.CREATED)
    @Post('createProduct')
    @UseInterceptors(FileInterceptor('photo'))
    createProduct(@GetUser('userId') userId: any, @UploadedFile() file: Express.Multer.File, @Body() dto: CreateProduct){
        return this.productService.createProduct(userId, file.originalname, file.buffer, dto )
    }

    @HttpCode(HttpStatus.OK)
    @Delete('deleteProduct/:id')
    deleteProduct(@GetUser('userId') userId: any, @Param('id') productId: string){        
        return this.productService.deleteProduct(userId, productId)
    }

    @HttpCode(HttpStatus.OK)
    @Get()
    getProducts(@GetUser('userId') userId: any){
        return this.productService.getAllProducts(userId)
    }

    @HttpCode(HttpStatus.OK)
    @Get(':id')
    getProductsById(@GetUser('userId') userId: any, @Param('id') productId: string){
        return this.productService.getProductById(userId, productId)
    }

    /*
    This function was supposed to be in the service file but due to some issues, I did it here while still trying
    to think of a work around solution for it to make it better and more presentable.
    */

    @HttpCode(HttpStatus.OK)
    @Patch('editProduct/:id')
    @UseInterceptors(FileInterceptor('photo'))
    async updateProduct(@GetUser('userId') userId: any, @Param('id') productId: string, @Body() dto: EditProduct, 
    @UploadedFile() file: Express.Multer.File, @Req() request: Express.Request){        
        const product = await this.productModel.findById({_id: productId})
        if(!product){
            throw new NotFoundException({ status: "false", message: "Product does not exists"})
        }
        if(request.file){
            const uploadedFile = await this.s3.upload({
                Bucket: this.bucketName,
                Body: file.buffer,
                Key: `${file.originalname}`,
            }).promise()

            // delete old file from S3
            const oldFileKey = product.photo?.split("/").pop();
            await this.s3.deleteObject({
                Bucket: this.bucketName,
                Key: oldFileKey
            }).promise()

            //update the product's photo
            product.photo = uploadedFile.Location
        }
        //update the other fields
        product.productName = dto.productName || product.productName 
        product.price = dto.price || product.price 

        const prod = await product.save()
        return {message: "Products updated successfully", prod}
    }
}
