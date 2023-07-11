import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUp, signIn } from './dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @HttpCode(HttpStatus.CREATED)
    @Post('signup')
    signup(@Body() dto: SignUp){
        return this.authService.signUp(dto)
    }

    @HttpCode(HttpStatus.OK)
    @Post('signin')
    signin(@Body() dto: signIn){
        return this.authService.signIn(dto)
    }
}
