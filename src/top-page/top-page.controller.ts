import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	NotFoundException,
	Param,
	Patch,
	Post, UseGuards,
	UsePipes, ValidationPipe
} from '@nestjs/common';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { TopPageService } from './top-page.service';
import { PAGE_NOT_FOUND } from './top-page.constants';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';


@Controller('top-page')
export class TopPageController {

	constructor(private readonly topPageService:TopPageService){}

	@UseGuards(JwtAuthGuard)
	@Post('create')
	async create(@Body() dto: CreateTopPageDto):Promise<CreateTopPageDto> {
		return this.topPageService.create(dto);
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	async get(@Param('id', IdValidationPipe) id: string) {
		const page = await this.topPageService.getById(id);
		if(!page){
			throw new NotFoundException(PAGE_NOT_FOUND);
		}
		return page;
	}

	@Get('byAlias/:alias')
	async getByAlias(@Param('alias') alias: string) {
		const page = await this.topPageService.findByAlias(alias);
		if(!page){
			throw new NotFoundException(PAGE_NOT_FOUND);
		}
		return page;
	}

	@UseGuards(JwtAuthGuard)
	@Patch('/:id')
	async patch(@Param('id', IdValidationPipe) id: string, @Body() dto: CreateTopPageDto) {
		const updatedPage = await this.topPageService.updateById(id,dto);
		if(!updatedPage){
			throw new NotFoundException(PAGE_NOT_FOUND);
		}
		return updatedPage;
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string):Promise<void> {
		const deletedPage = await this.topPageService.deleteById(id);
		if(!deletedPage){
			throw new NotFoundException(PAGE_NOT_FOUND);
		}
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('find')
	async find(@Body('') dto: FindTopPageDto){
		  return this.topPageService.findByCategory(dto.firstLevelCategory);
	}

	@Get('textSearch/:text')
	async textSearch(@Param('text') text: string){
		return this.topPageService.searchByText(text);
	}

}
