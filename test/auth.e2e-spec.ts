import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import {  disconnect } from 'mongoose';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { AppModule } from '../src/app.module';

const loginDTO: AuthDto = {
	login: 'a@a.com',
	password: '123asd1',
};

describe('AuthController (e2e)', ()=>{

	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('/auth/signin => (SUCCESS)' ,()=>{
		return request(app.getHttpServer())
			.post('/auth/signin')
			.send(loginDTO)
			.expect(200)
			.then(({body}:request.Response) => {
				expect(body.access_token).toBeDefined();
			});
	});

	it('/auth/signin => (FAIL password)' ,()=>{
		return request(app.getHttpServer())
			.post('/auth/signin')
			.send({...loginDTO,password:'ghgh'})
			.expect(401,{
				statusCode: 401,
				message: 'Password you typed is wrong, check your language and try again',
				error: 'Unauthorized'
			});
	});

	it('/auth/signin => (FAIL email)' ,()=>{
		return request(app.getHttpServer())
			.post('/auth/signin')
			.send({...loginDTO,login:'a2@a2.com'})
			.expect(401,{
				statusCode: 401,
				message: 'This email address not found in our DataBase',
				error: 'Unauthorized'
			});
	});
	afterAll(()=>{
		disconnect();
	});
});
