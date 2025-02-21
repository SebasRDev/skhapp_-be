import { IsInt, Min, IsString } from 'class-validator';

export class KitProductDto {
  @IsString()
  code: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
