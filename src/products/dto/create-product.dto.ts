import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  readonly code: string;
  @IsString()
  readonly name: string;
  @IsNumber()
  @IsOptional()
  readonly publicPrice?: number;
  @IsNumber()
  @IsOptional()
  readonly efficiency?: number;
  @IsNumber()
  readonly profesionalPrice: number;
  @IsString()
  readonly actives: string;
  @IsString({ each: true })
  @IsArray()
  readonly properties: string[];
  @IsString()
  readonly phase: string;
  @IsString()
  readonly time: string;
}
