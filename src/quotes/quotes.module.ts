import { Module } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { QuotesController } from './quotes.controller';
import { PrinterModule } from 'src/printer/printer.module';

@Module({
  controllers: [QuotesController],
  providers: [QuotesService],
  imports: [PrinterModule],
})
export class QuotesModule {}
