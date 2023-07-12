import { IsMongoId, IsOptional, IsString } from "class-validator"
import { User } from "src/user/userSchema"


export class EditProduct{
    @IsString()
    @IsOptional()
    productName: string

    @IsString()
    @IsOptional()
    price: string

    @IsString()
    @IsOptional()
    photo: string

    @IsMongoId()
    creator: User
}