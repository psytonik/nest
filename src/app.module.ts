import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TopPageModule } from './top-page/top-page.module';
import { ProductModule } from './products/product.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypegooseModule } from 'nestjs-typegoose';
import { getMongoConfig } from './config/mongo.config';

@Module({
  imports: [
		AuthModule,
		TopPageModule,
		ProductModule,
		ReviewsModule,
		ConfigModule.forRoot(),
		TypegooseModule.forRootAsync({
		imports: [ConfigModule],
			inject:[ConfigService],
			useFactory: getMongoConfig
  	})
	]
})
export class AppModule {}
