import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/userSchema';
import { SignUp, signIn } from './dto';
import * as argon from 'argon2'
import { ConfigService } from '@nestjs/config';
import {JwtService} from '@nestjs/jwt'

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, 
        private config: ConfigService, private jwt: JwtService
    ){}

    async signUp(signUp: SignUp){
        const user = await this.userModel.findOne({email: signUp.email})
        if(user){
            throw new BadRequestException('User with this email already exists, please sign in')
        }
        const hash = await argon.hash(signUp.password)

        const newUser = new this.userModel({
            firstName: signUp.firstName,
            lastName: signUp.lastName,
            email: signUp.email,
            password: hash
        })
        await newUser.save()
        return {_id: newUser._id, firstName: newUser.firstName, lastName: newUser.lastName, email: newUser.email}
    }

    async signIn(signIn: signIn){
        const user = await this.userModel.findOne({email: signIn.email})
        if(!user){
            throw new NotFoundException("Email incorrect or does not exist")
        }
        const pwMatches = await argon.verify(user.password, signIn.password)
        if(!pwMatches){
            throw new ForbiddenException("Password incorrect")
        }
        delete user.password
        return this.signToken(user._id, user.email)
    }

    async signToken(userId: any, email: string): Promise<{access_token: string}>{
        const payload = {
            userId, email
        }
        const secret = this.config.get('JWT_SECRET')

        const token = await this.jwt.signAsync(payload, {expiresIn: '30m', secret: secret})

        return {
            access_token: token
        }
    }
}
