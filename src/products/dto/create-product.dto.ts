import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  readonly code: string;
  @IsString()
  readonly name: string;
  @IsNumber()
  @IsOptional()
  readonly publicPrice?: number | null;
  @IsNumber()
  @IsOptional()
  readonly efficiency?: number | null;
  @IsNumber()
  readonly profesionalPrice: number;
  @IsString()
  readonly actives: string;
  @IsString({ each: true })
  @IsArray()
  @IsOptional({ each: true })
  readonly properties: string[];
  @IsString()
  @IsOptional()
  readonly phase: string;
  @IsString()
  @IsOptional()
  readonly time: string;
  @IsString()
  @IsOptional()
  image?: string | null;
}
