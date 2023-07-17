import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import {PassportStrategy} from '@nestjs/passport'
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User, UserDocument } from 'src/user/userSchema';

@Injectable()

export class JwTStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(configService: ConfigService, @InjectModel(User.name) private userModel: Model<UserDocument>){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_SECRET')
        })
    }
    async validate(payload: {sub: any, email: string, firstName: string, lastName: string}){
        const user = this.userModel.findById({_id: payload.sub})

        // delete (await user).password
        return payload
    }
}