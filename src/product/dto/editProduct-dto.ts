import { IsOptional, IsString } from "class-validator"


export class EditProduct{
    @IsString()
    @IsOptional()
    productName: string

    @IsString()
    @IsOptional()
    price: string

}