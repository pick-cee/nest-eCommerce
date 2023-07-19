import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum'
import { SignUp, signIn } from '../src/auth/dto';
import { AppTestModule } from '../src/appTest.module';
import { MongooseService } from '../src/appTest.Service';



describe('AppController (e2e)', () => {
  let app: INestApplication;
  let mongod: MongooseService
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppTestModule],
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
    await mongod.cleanDb()
  })

  describe("Auth", () => {
    const dto: SignUp = {
      email: "akinloluwaolumuyide@gmail.com",
      password: "AKINLOLUWA",
      firstName: "Akin",
      lastName: "Olum"
    }
    const signIn: signIn = {
      email: "akinloluwaolumuyide@gmail.com",
      password: "AKINLOLUWA"
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
    describe("it should sign in", () => {
      it("should throw an exception if email empty", () => {
        return pactum.spec().post('/auth/signin').withBody({password: signIn.password}).expectStatus(400)
      })
      it("should throw an exception if password empty", () => {
        return pactum.spec().post('/auth/signin').withBody({email: signIn.email}).expectStatus(400)
      })
      it("should throw an exception if no email and password", () => {
        return pactum.spec().post('/auth/signin').expectStatus(400)
      })
      it('should sign in', () => {
        return pactum.spec().post('/auth/signin').withBody(signIn).expectStatus(200).stores('userAt', 'access_token')
      })
    })
  })
});
