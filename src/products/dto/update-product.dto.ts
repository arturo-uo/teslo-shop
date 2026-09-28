import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

//Si el api va a estar documento se debe usar @nestjs/swagger, 
// en caso contrario se usa mapped-types
//import { PartialType } from '@nestjs/mapped-types';
export class UpdateProductDto extends PartialType(CreateProductDto) {}
