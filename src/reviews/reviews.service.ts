import { Injectable } from '@nestjs/common';
import { ReviewsModel } from './reviews.model';
import { ModelType, DocumentType } from '@typegoose/typegoose/lib/types';
import { CreateReviewsDto } from './dto/create-reviews.dto';
import { Types } from 'mongoose';
import { InjectModel } from 'nestjs-typegoose';

@Injectable()
export class ReviewsService {
	constructor(@InjectModel(ReviewsModel) private readonly reviewModel: ModelType<ReviewsModel>) { }

	async create(dto:CreateReviewsDto): Promise<DocumentType<ReviewsModel>> {
		return this.reviewModel.create(dto);
	}

	async delete(id:string): Promise<DocumentType<ReviewsModel> | null> {
		return this.reviewModel.findByIdAndDelete(id).exec();
	}

	async findByProductId(productId: string): Promise<DocumentType<ReviewsModel>[]> {
		return this.reviewModel.find({ productId: new Types.ObjectId(productId) }).exec();
	}

	async deleteByProductId(productId: string) {
		return this.reviewModel.deleteMany({ productId: new Types.ObjectId(productId) }).exec();
	}

	async getReviews():Promise<ReviewsModel[]>{
		return this.reviewModel.find();
	}
}
