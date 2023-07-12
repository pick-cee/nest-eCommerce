import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './userSchema';
import { Model } from 'mongoose';
import { EditUserDTO } from './dto/edit-user.dto';
import * as argon from 'argon2'

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>){}

    async changePassword(userId: any, password: string){
        const user = await this.userModel.findById({_id: userId}).exec()
        if(!user){
            throw new NotFoundException("User not found")
        }
        const newHash = await argon.hash(password)
        user.password = newHash
        await user.save()
        return {message: 'Password changed successfully'}
    }

    async updateUser(userId: any, dto: EditUserDTO){
        const user = await this.userModel.findById({_id: userId}).exec()       
        if(!user){
            throw new NotFoundException("User not found")
        }
        const updatedUser = await user.updateOne({$set: dto}, {new: true}).exec()
        return updatedUser
    }

    async deleteUser(userId: number){
        const user = await this.userModel.findByIdAndDelete({_id: userId}).exec()
        if(!user){
            throw new NotFoundException("User not found")
        }
        return { message: "user deleted successfully"}
    }

}
