import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Mongoose } from 'mongoose';


@Injectable()
export class MongooseService extends Mongoose {
    constructor(config: ConfigService) {
        super({ })
    }
    cleanDb(){
        return this.cleanDb()
    }
}
