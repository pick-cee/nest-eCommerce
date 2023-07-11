import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfigurationModule } from './configuration';
import { PaymentModule } from './payment/payment.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [AuthModule, UserModule,ConfigModule.forRoot({isGlobal: true}), 
   AppConfigurationModule, MongooseModule.forRootAsync({
    imports: [AppConfigurationModule],
    useFactory: async (config: ConfigService) => {
      const uri = config.get('MONGODB_URI')
      return {
        uri: uri
      }
    },
    inject: [ConfigService]
   }),
   UserModule, AuthModule, PaymentModule, ProductModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}