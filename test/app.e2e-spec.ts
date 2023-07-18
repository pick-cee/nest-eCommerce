import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum'
import { AppModule } from '../src/app.module';
import { SignUp } from '../src/auth/dto';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, connect } from 'mongoose';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer
  let mongoConnection: Connection;
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create()
    const uri = mongod.getUri('nestEcommTest')
    console.log(uri);
    
    mongoConnection = (await connect(uri)).connection
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleRef.createNestApplication()
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true
    }))

    await app.init()
    await app.listen(5000)

    pactum.request.setBaseUrl("http://localhost:5000")
  })

  afterAll(async () => {
    await app.close()
  })

  describe("Auth", () => {
    const dto: SignUp = {
      email: "akinloluwaolumuyide@gmail.com",
      password: "AKINLOLUWA",
      firstName: "Akin",
      lastName: "Olum"
    }
    describe("it should sign up", () => {
      it("should throw an exception if email empty", () => {
        return pactum.spec().post('/auth/signup').withBody({password: dto.password}).expectStatus(400)
      })
      it("should throw an exception if password empty", () => {
        return pactum.spec().post('/auth/signup').withBody({email: dto.email}).expectStatus(400)
      })
      it("should throw an exception if no email and password and first name and last name", () => {
        return pactum.spec().post('/auth/signup').expectStatus(400)
      })
      it('should sign up', () => {
        return pactum.spec().post('/auth/signup').withBody(dto).expectStatus(201)
      })
    })
  })
});
