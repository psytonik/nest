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
import { ProductModel } from './product.model';
import { FindProductDto } from './dto/find-product.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { PRODUCT_NOT_FOUND } from './product.constants';
import { IdValidationPipe } from '../pipes/id-validation.pipe';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('product')
export class ProductController {

	constructor(private readonly productsService: ProductsService){}

	@UseGuards(JwtAuthGuard)
	@Post('create')
	async create(@Body() dto: CreateProductDto) {
		return this.productsService.create(dto);
	}

	@UseGuards(JwtAuthGuard)
	@Get(':id')
	async get(@Param('id', IdValidationPipe) id: string) {
		const product = await this.productsService.findById(id);
		if(!product){
			throw new NotFoundException(PRODUCT_NOT_FOUND);
		}
		return product;
	}

	@UseGuards(JwtAuthGuard)
	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string):Promise<void> {
		const deleted = await this.productsService.deleteById(id);
		if(!deleted){
			throw new NotFoundException(PRODUCT_NOT_FOUND);
		}
		return;
	}

	@UseGuards(JwtAuthGuard)
	@Patch(':id')
	async patch(@Param('id', IdValidationPipe) id: string, @Body() dto: ProductModel) {
		const updatedProduct = await this.productsService.updateProductById(id,dto);
		if(!updatedProduct){
			throw new NotFoundException(PRODUCT_NOT_FOUND);
		}
		return updatedProduct;
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('find')
	async find(@Body('') dto: FindProductDto):Promise<ProductModel[]> {
		return this.productsService.findWithReviews(dto);
	}

	@Get('')
	async getAll():Promise<ProductModel[]> {
		return this.productsService.getAll();
	}
}
