import { Injectable, NotFoundException } from '@nestjs/common';
import { PrinterService } from 'src/printer/printer.service';
import { formulaReport } from './documents/formula.report';
import FormulaReport from 'src/quotes/interfaces/formula.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Repository } from 'typeorm';
import { quoteReport } from 'src/quotes/documents/quote.report';
import { Kit } from 'src/kits/entities/kit.entity';

@Injectable()
export class QuotesService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    @InjectRepository(Kit)
    private readonly kitRepository: Repository<Kit>,

    private readonly printer: PrinterService,
  ) {}

  async getReport(quoteData: FormulaReport, type: 'formula' | 'quote') {
    const { data, products, kit } = quoteData;

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

    // Only look for a kit if a kit ID is provided
    let formulaKit: Kit | null = null;
    if (kit) {
      formulaKit = await this.kitRepository.findOneBy({ id: kit });
      console.log('kit ID provided:', kit);
      console.log('formulaKit found:', formulaKit);
    }

    let docDefinition: any;
    if (type === 'formula') {
      docDefinition = formulaReport(data, formulaProducts, formulaKit);
    }
    if (type === 'quote') {
      docDefinition = quoteReport(data, formulaProducts);
    }
    return this.printer.createPdf(docDefinition);
  }
}
