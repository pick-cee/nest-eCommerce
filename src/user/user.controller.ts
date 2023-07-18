import { Body, Controller, Delete, HttpCode, HttpStatus, Patch, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { GetUser } from '../auth/decorator';
import { EditUserDTO } from './dto/edit-user.dto';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){}

    @HttpCode(HttpStatus.OK)
    @Patch('changePassword')
    changePassword(@GetUser('userId') userId: any, @Body('password') password: string){
        return this.userService.changePassword(userId, password)
    }

    @HttpCode(HttpStatus.OK)
    @Patch('editUser')
    updateUser(@GetUser('userId') userId: any, @Body() dto: EditUserDTO){
        return this.userService.updateUser(userId, dto)
    }

    @HttpCode(HttpStatus.OK)
    @Delete('deleteUser')
    deleteUser(@GetUser('userId') userId: any){
        return this.userService.deleteUser(userId)
    }
}
