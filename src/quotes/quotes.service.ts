import { Injectable, NotFoundException } from '@nestjs/common';
import { PrinterService } from 'src/printer/printer.service';
import { formulaReport } from './documents/formula.report';
import FormulaReport from 'src/quotes/interfaces/formula.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Repository } from 'typeorm';
import { quoteReport } from 'src/quotes/documents/quote.report';

@Injectable()
export class QuotesService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    private readonly printer: PrinterService,
  ) {}

  async getReport(quoteData: FormulaReport, type: 'formula' | 'quote') {
    const { data, products } = quoteData;

    const formulaProducts = await Promise.all(
      products.map(async (product) => {
        const productDB = await this.productsRepository.findOneBy({
          id: product.id,
        });
        if (!productDB) throw new NotFoundException('Product not found');
        return {
          ...productDB,
          quantity: product.quantity,
          discount: product.discount,
        };
      }),
    );

    let docDefinition: any;
    if (type === 'formula') {
      docDefinition = formulaReport(data, formulaProducts);
    }
    if (type === 'quote') {
      docDefinition = quoteReport(data, formulaProducts);
    }
    return this.printer.createPdf(docDefinition);
  }
}
