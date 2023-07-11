import { IsEmail, IsOptional, IsString } from "class-validator"


export class EditUserDTO{
    @IsString()
    @IsOptional()
    firstName?: string

    @IsString()
    @IsOptional()
    lastName?: string

    @IsOptional()
    @IsEmail()
    email?: string

}