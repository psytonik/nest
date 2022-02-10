import { IsString, IsNumber, Min, Max } from 'class-validator';

export class CreateReviewsDto {
	@IsString()
	name:string;

	@IsString()
	title:string;

	@IsString()
	description:string;

	@Min(1, {message: 'Rating cant be less than 1'})
	@Max(5)
	@IsNumber()
	rating:number;

	@IsString()
	productId: string;
}