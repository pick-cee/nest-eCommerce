import { Body, Controller, HttpCode, HttpStatus, Patch, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from 'src/auth/decorator';
import { EditUserDTO } from './dto/edit-user.dto';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){}

    @HttpCode(HttpStatus.OK)
    @Patch('editUser')
    updateUser(@GetUser('_id') userId: any, @Body() dto: EditUserDTO){
        return this.userService.updateUser(userId, dto)
    }
}
