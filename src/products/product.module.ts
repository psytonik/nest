import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { TypegooseModule } from 'nestjs-typegoose';
import { ProductsService } from './products.service';
import { ProductModel } from './product.model';

@Module({
  controllers: [ProductController],
  imports:[
	TypegooseModule.forFeature([{
		typegooseClass:ProductModel,
		schemaOptions:{
			collection:'Product'
		}
	}])
  ],
  providers: [ProductsService]
})
export class ProductModule {}
