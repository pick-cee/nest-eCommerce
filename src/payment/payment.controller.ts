import { Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('payment')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService){}

    @HttpCode(HttpStatus.CREATED)
    @Post('makePayment/:id')
    makePayment(@GetUser('userId') userId: any, @Param('id') productId: string){
        return this.paymentService.makePayment(userId, productId)
    }

    @HttpCode(HttpStatus.OK)
    @Get('verifyPayment/:id')
    verifyPayment(@Param('id') paymentId: any){
        return this.paymentService.verifyPayment(paymentId)
    }
    @HttpCode(HttpStatus.OK)
    @Get('/paymentHistory')
    getPaymentHistory(@GetUser('userId') userId: any){
        return this.paymentService.getPaymentHistory(userId)
    }
}
