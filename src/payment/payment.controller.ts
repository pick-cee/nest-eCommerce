import { Controller, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
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
}
