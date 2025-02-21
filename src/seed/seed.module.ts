import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProductsModule } from 'src/products/products.module';
import { KitsModule } from 'src/kits/kits.module';

@Module({
  imports: [ProductsModule, KitsModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
