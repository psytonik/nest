import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ProductModel } from './product.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find-product.dto';
import { ReviewsModel } from '../reviews/reviews.model';

@Injectable()
export class ProductsService {
	constructor(@InjectModel(ProductModel) private readonly productModel:ModelType<ProductModel> ){}

	async create(dto:CreateProductDto){
		return this.productModel.create(dto);
	}
	async getAll():Promise<ProductModel[]>{
		return this.productModel.find().exec();
	}
	async findById(id: string):Promise<ProductModel>{
		return this.productModel.findById(id).exec();
	}
	async deleteById(id:string):Promise<ProductModel>{
		return this.productModel.findByIdAndDelete( id ).exec();
	}
	async updateProductById(id:string, dto:CreateProductDto):Promise<ProductModel>{
		return this.productModel.findByIdAndUpdate( id, dto,{new: true} ).exec();
	}

	async findWithReviews(dto:FindProductDto):Promise<ProductModel[]>{
		return await this.productModel.aggregate([
			{
				$match: {
					categories: dto.category,
				}
			},
			{
				$sort: { _id: 1 }
			},
			{
				$limit: dto.limit
			},
			{
				$lookup: {
					from: 'Review',
					localField: '_id',
					foreignField: 'productId',
					as: 'review'
				}
			},
			{
				$addFields: {
					reviewCount: { $size: '$review' },
					reviewAvg: { $avg: '$review.rating' },
					review: {
						$function: {
							body:`function(review){
								review.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt));
								return review;
							}`,
							arguments:['$review'],
							lang:'js'
						}
					}
				}
			}
		]).exec() as (ProductModel & { review: ReviewsModel[], reviewCount: number, reviewAvg: number })[];
	}
}
