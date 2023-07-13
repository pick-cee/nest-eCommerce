import { IsMongoId, IsNotEmpty, IsString } from "class-validator"
import { User } from "src/user/userSchema"


export class CreateProduct{
    @IsString()
    @IsNotEmpty()
    productName: string

    @IsString()
    @IsNotEmpty()
    price: string

    creator: User
}