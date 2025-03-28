/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrinterService } from 'src/printer/printer.service';
import { formulaReport } from './documents/formula.report';
import FormulaReport from 'src/quotes/interfaces/formula.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { Repository } from 'typeorm';
import { quoteReport } from 'src/quotes/documents/quote.report';
import { Kit } from 'src/kits/entities/kit.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class QuotesService {
  private readonly logger = new Logger(QuotesService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    @InjectRepository(Kit)
    private readonly kitRepository: Repository<Kit>,

    private readonly printer: PrinterService,
    private readonly httpService: HttpService,
  ) {}

  async getReport(quoteData: FormulaReport, type: 'formula' | 'quote') {
    const { data, products, kit } = quoteData;

    const formulaProducts = await Promise.all(
      products.map(async (product) => {
        const productDB = await this.productsRepository.findOneBy({
          id: product.id,
        });
        if (!productDB)
          throw new NotFoundException(`Product ${product.id} not found`);
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
    }

    let kitImageBase64: string | null = null;
    if (formulaKit && formulaKit.imageLink) {
      // Si tenemos un kit y tiene link de imagen
      this.logger.log(
        `Attempting to fetch image from: ${formulaKit.imageLink}`,
      );
      try {
        // Typed as ArrayBuffer for clarity and type-safety
        const response: AxiosResponse<ArrayBuffer> = await firstValueFrom(
          this.httpService.get<ArrayBuffer>(formulaKit.imageLink, {
            responseType: 'arraybuffer', // MUY IMPORTANTE para obtener datos binarios
          }),
        );

        // Ensure proper typing when creating Buffer
        const buffer = Buffer.from(response.data);

        // Convierte el Buffer a base64 y crea el Data URI
        // Intenta detectar el tipo de imagen desde la URL o usa un default (ej: png)
        let mimeType = 'image/png'; // Default
        const extensionMatch = formulaKit.imageLink.match(
          /\.(jpe?g|png|gif|webp)$/i,
        );
        if (extensionMatch && extensionMatch[1]) {
          mimeType = `image/${extensionMatch[1].toLowerCase().replace('jpg', 'jpeg')}`;
        }
        kitImageBase64 = `data:${mimeType};base64,${buffer.toString('base64')}`;
        this.logger.log(
          `Successfully fetched and converted image for kit ${formulaKit.id}. MimeType: ${mimeType}`,
        );
        formulaKit.imageLink = kitImageBase64;
      } catch (error) {
        // Type-safe error handling
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        this.logger.error(
          `Failed to fetch or convert image from ${formulaKit.imageLink}: ${errorMessage}`,
        );
        // kitImageBase64 permanecerá null, el reporte se generará sin la imagen
      }
    } else if (formulaKit && !formulaKit.imageLink) {
      this.logger.warn(`Kit ${formulaKit.id} found, but it has no imageLink.`);
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
