import { Module } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { QuotesController } from './quotes.controller';
import { PrinterModule } from 'src/printer/printer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { ProductsModule } from 'src/products/products.module';
import { KitsModule } from 'src/kits/kits.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [QuotesController],
  providers: [QuotesService],
  imports: [
    PrinterModule,
    TypeOrmModule.forFeature([Product]),
    ProductsModule,
    KitsModule,
    HttpModule,
  ],
})
export class QuotesModule {}
