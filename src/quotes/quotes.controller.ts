import { Body, Controller, Post, Res } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { Response } from 'express';
import Report from 'src/quotes/interfaces/formula.interface';

@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post('formula')
  async getFormulaReport(@Body() params: Report, @Res() response: Response) {
    const { data } = params;
    const pdfDoc = await this.quotesService.getReport(params, 'formula');
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = `formula ${data?.name}`;
    pdfDoc.pipe(response);
    pdfDoc.end();
  }

  @Post('quote')
  async getQuoteReport(@Body() params: Report, @Res() response: Response) {
    const { data } = params;
    const pdfDoc = await this.quotesService.getReport(params, 'quote');
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = `Cotización ${data?.name}`;
    pdfDoc.pipe(response);
    pdfDoc.end();
  }
}
