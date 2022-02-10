import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { ReviewsModel } from './reviews.model';
import { ReviewsService } from './reviews.service';

@Module({
  controllers: [ReviewsController],
  imports:[
	TypegooseModule.forFeature([{
		typegooseClass:ReviewsModel,
		schemaOptions:{
		collection:'Review'
		}
	}])
  ],
  providers: [ReviewsService]
})
export class ReviewsModule {}
