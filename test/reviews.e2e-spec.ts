import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateReviewsDto } from '../src/reviews/dto/create-reviews.dto';
import { Types, disconnect } from 'mongoose';
import { REVIEW_NOT_FOUND } from '../src/reviews/review.constants';
import { AuthDto } from '../src/auth/dto/auth.dto';

const productId = new Types.ObjectId().toHexString();
const loginDTO: AuthDto = {
	login: 'a@a.com',
	password: '123asd1',
};

const testDTO: CreateReviewsDto = {
	productId,
	rating: 5,
	name: 'test',
	title: 'Title',
	description: 'Description of'
};


describe('AppController (e2e)', () => {
	let app: INestApplication;
	let createdId: string;
	let token: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
		const { body } = await request(app.getHttpServer())
			.post('/auth/signin')
			.send(loginDTO);
		token = body.access_token;

  });

  it('/reviews/create (POST)', async() => {
	return request(app.getHttpServer())
		.post('/reviews/create')
		.send(testDTO)
		.expect(201)
		.then(({ body }:request.Response) => {
			createdId = body._id;
			expect(createdId).toBeDefined();
		});
  });

	it('/reviews/create (POST) - Failed', () => {
		return request(app.getHttpServer())
			.post('/reviews/create')
			.send({ ...testDTO, rating: 0 })
			.expect(400);
	});

	it('/byProduct/:productId (GET) - success', async()=> {
		return request(app.getHttpServer())
			.get(`/reviews/byProduct/${productId}`)
			.expect(200)
			.then(({ body }:request.Response)=> {
				expect(body.length).toBe(1);
			});
	});

	it('/byProduct/:productId (GET) - error 404', async()=> {
		return request(app.getHttpServer())
			.get(`/reviews/byProduct/${new Types.ObjectId().toHexString()}`)
			.expect(200)
			.then(({ body }:request.Response)=> {
				expect(body.length).toBe(0);
			});
	});

	it('/reviews/:id (DELETE) - success', ()=> {
		return request(app.getHttpServer())
			.delete(`/reviews/${createdId}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(200);
	});

	it('/reviews/:id (DELETE) - failure', ()=> {
		return request(app.getHttpServer())
			.delete(`/reviews/${new Types.ObjectId().toHexString()}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(404,{statusCode :404, message: REVIEW_NOT_FOUND});
	});


	afterAll(()=>{
		disconnect();
	});
});