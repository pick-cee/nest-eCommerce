import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class signIn {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}