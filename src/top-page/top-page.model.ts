import { Base, TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { prop,index } from '@typegoose/typegoose';

export enum TopLevelCategory {
	Courses,
	Services,
	Books,
	Products
}

export class VacanciesData {

	@prop()
	count:number;

	@prop()
	juniorSalary: number;

	@prop()
	middleSalary: number;

	@prop()
	seniorSalary: number;
}

export class AdvantagesData {
	@prop()
	title:string;

	@prop()
	description: string;
}

export interface TopPageModel extends Base {}

@index({ '$**': 'text' })
export class TopPageModel extends TimeStamps {

	@prop({enum: TopLevelCategory})
	firstLevelCategory: TopLevelCategory;

	@prop()
	secondLevelCategory: string;

	@prop({text:true})
	title:string;

	@prop({unique:true})
	alias:string;

	@prop()
	category: string;

	@prop({ type: () => VacanciesData })
	vacancies?: VacanciesData;

	@prop({ type: () => [AdvantagesData] })
	advantages: AdvantagesData[];

	@prop()
	seoText: string;

	@prop()
	tagsTitle: string;

	@prop({ type: () => [String] })
	tags: string[];
}
