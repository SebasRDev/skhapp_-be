import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { Response } from 'express';
import FormulaReport from 'src/quotes/interfaces/formula.interface';

@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  // @Get('formula')
  // getFormulaReport(@Res() response: Response) {
  //   const pdfDoc = this.quotesService.getFormulaReport();
  //   response.setHeader('Content-Type', 'application/pdf');
  //   pdfDoc.info.Title = 'Cotizacion Sebastian Ramirez';
  //   pdfDoc.pipe(response);
  //   pdfDoc.end();
  // }

  @Post('formula')
  getFormulaReport(@Body() params: FormulaReport, @Res() response: Response) {
    const { client } = params;
    const pdfDoc = this.quotesService.getFormulaReport(params);
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = `formula ${client?.name}`;
    pdfDoc.pipe(response);
    pdfDoc.end();
  }
}
