import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { TopLevelCategory, TopPageModel } from './top-page.model';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { ModelType } from '@typegoose/typegoose/lib/types';

@Injectable()
export class TopPageService {
	constructor(@InjectModel(TopPageModel) private readonly topPageModel: ModelType<TopPageModel>){}

	async create(dto:CreateTopPageDto):Promise<CreateTopPageDto>{
		return this.topPageModel.create(dto);
	}

	async getById(id:string){
		return this.topPageModel.findById(id).exec();
	}
	async findByAlias(alias:string){
		return this.topPageModel.findOne({alias}).exec();
	}
	async findByCategory(firstLevelCategory: TopLevelCategory){
		return this.topPageModel
			.aggregate()
			.match({firstLevelCategory})
			.group({
				_id: { secondLevelCategory :'$secondLevelCategory'},
				pages: { $push :{alias:'$alias', title:'$title'}}
			})
			.exec();

	}

	async deleteById(id:string) {
		return this.topPageModel.findByIdAndDelete(id).exec();
	}
	async updateById(id:string, dto:CreateTopPageDto) {
		return this.topPageModel.findByIdAndUpdate(id,dto,{new: true}).exec();
	}

	async searchByText(text:string) {
		return this.topPageModel.find({ $text:{$search:text, $caseSensitive:false} }).exec();
	}

}
