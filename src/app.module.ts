import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfigurationModule } from './configuration';
import { PaymentModule } from './payment/payment.module';
import { ProductModule } from './product/product.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { PaystackModule } from 'nestjs-paystack';

@Module({
  imports: [AuthModule, UserModule,ConfigModule.forRoot({isGlobal: true}), 
    RedisModule.forRoot({
      config: {
        host: 'localhost',
        port: 6379
      }
    }),
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
   UserModule, AuthModule, PaymentModule, ProductModule,
   PaystackModule.forRootAsync({
    useFactory: async (config: ConfigService) => {
      const secretKey = config.get("PAYSTACK_SECRET_KEY")
      return {
        apiKey: secretKey
      }
    },
    inject: [ConfigService]
   })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
