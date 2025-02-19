import { Injectable } from '@nestjs/common';
import { PrinterService } from 'src/printer/printer.service';
import { formulaReport } from './documents/formula.report';
import FormulaReport from 'src/quotes/interfaces/formula.interface';

@Injectable()
export class QuotesService {
  constructor(private readonly printer: PrinterService) {}

  getFormulaReport(data: FormulaReport) {
    const docDefinition = formulaReport(data);
    return this.printer.createPdf(docDefinition);
  }
}
