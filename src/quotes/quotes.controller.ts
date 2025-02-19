import { Body, Controller, Post, Res } from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { Response } from 'express';
import FormulaReport from 'src/quotes/interfaces/formula.interface';

@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotesService: QuotesService) {}

  @Post('formula')
  async getFormulaReport(
    @Body() params: FormulaReport,
    @Res() response: Response,
  ) {
    const { data } = params;
    const pdfDoc = await this.quotesService.getFormulaReport(params);
    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = `formula ${data?.name}`;
    pdfDoc.pipe(response);
    pdfDoc.end();
  }
}
