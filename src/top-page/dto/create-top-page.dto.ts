import {TopLevelCategory} from '../top-page.model';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class VacanciesDataDto {

	@IsNumber()
	count:number;

	@IsNumber()
	juniorSalary: number;

	@IsNumber()
	middleSalary: number;

	@IsNumber()
	seniorSalary: number;
}

export class AdvantagesDataDto {
	@IsString()
	title:string;

	@IsString()
	description: string;
}

export class CreateTopPageDto {

	@IsEnum(TopLevelCategory)
	firstLevelCategory: TopLevelCategory;

	@IsString()
	secondLevelCategory: string;

	@IsString()
	title:string;

	@IsString()
	alias:string;

	@IsString()
	category: string;

	@IsOptional()
	@ValidateNested()
	@Type(()=>VacanciesDataDto)
	vacancies?: VacanciesDataDto;

	@IsArray()
	@ValidateNested()
	@Type(()=>AdvantagesDataDto)
	advantages: AdvantagesDataDto[];

	@IsString()
	seoText: string;

	@IsString()
	tagsTitle: string;

	@IsArray()
	@IsString({each:true})
	tags: string[];
}
