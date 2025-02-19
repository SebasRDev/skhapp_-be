import { Module } from '@nestjs/common';
import { KitsService } from './kits.service';
import { KitsController } from './kits.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Kit } from 'src/kits/entities/kit.entity';
import { KitProduct } from 'src/kits/entities/kit-product.entity';
import { Product } from 'src/products/entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Kit, KitProduct, Product])],
  controllers: [KitsController],
  providers: [KitsService],
  exports: [KitsService, TypeOrmModule],
})
export class KitsModule {}
