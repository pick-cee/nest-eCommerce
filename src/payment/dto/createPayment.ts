import { IsNotEmpty, IsString } from "class-validator"


export class CreatePayment{
    @IsString()
    @IsNotEmpty()
    price: string

    @IsString()
    @IsNotEmpty()
    referenceId: string

    @IsString()
    @IsNotEmpty()
    productId: string

    @IsString()
    @IsNotEmpty()
    userId: string

    @IsString()
    transactionStatus: string
}