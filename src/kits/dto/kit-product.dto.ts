import { IsUUID, IsInt, Min } from 'class-validator';

export class KitProductDto {
  @IsUUID()
  id: string;

  @IsInt()
  @Min(1)
  quantity: number;
}
