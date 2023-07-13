import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductService } from './product.service';
import { GetUser } from 'src/auth/decorator';
import { CreateProduct } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService){}

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

    @HttpCode(HttpStatus.OK)
    @Patch(':id')
    updateProduct(){}
}
