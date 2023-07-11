import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/user/userSchema';
import { JwtModule } from '@nestjs/jwt';
import { JwTStrategy } from './strategy';

@Module({
  imports: [MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
      JwtModule.register({})
  ],
  providers: [AuthService, JwTStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
