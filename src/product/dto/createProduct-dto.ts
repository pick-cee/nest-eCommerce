import { IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { User } from "src/user/userSchema"


export class CreateProduct{
    @IsString()
    @IsNotEmpty()
    productName: string

    @IsString()
    @IsNotEmpty()
    price: number

    // @IsOptional()
    // creator: User
}