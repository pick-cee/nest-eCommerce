import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './userSchema';
import { Model } from 'mongoose';
import { EditUserDTO } from './dto/edit-user.dto';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>){}

    async updateUser(userId: any, dto: EditUserDTO){
        const user = await this.userModel.findOne({_id: userId})
        if(!user){
            throw new NotFoundException("User not found")
        }
        const updatedUser = await user.updateOne({$set: dto}, {new: true})
        return updatedUser
    }

    async deleteUser(userId: number){
        await this.userModel.findOneAndDelete({_id: userId})

        return 'User deleted successfully'
    }
}
