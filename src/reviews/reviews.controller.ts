import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Post, UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { CreateReviewsDto } from './dto/create-reviews.dto';
import { ReviewsService } from './reviews.service';
import { REVIEW_NOT_FOUND } from './review.constants';
import { ReviewsModel } from './reviews.model';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { IdValidationPipe } from '../pipes/id-validation.pipe';

@Controller('reviews')
export class ReviewsController {
	constructor(private readonly reviewsService: ReviewsService){}

	@Get('byProduct/:productId')
	async getByProduct(@Param('productId', IdValidationPipe) productId: string ) {
		return this.reviewsService.findByProductId(productId);
	}

	@Get('')
	async getReviews():Promise<ReviewsModel[]> {
		return this.reviewsService.getReviews();
	}

	@UsePipes(new ValidationPipe())
	@Post('create')
	async create(@Body() dto: CreateReviewsDto) {
		return this.reviewsService.create(dto);
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string): Promise<void> {
		const deletedDoc = await this.reviewsService.delete(id);
		if(!deletedDoc){
			throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND);
		}
	}
}
