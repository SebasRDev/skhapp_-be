import { Injectable } from '@nestjs/common';
import { KitsService } from 'src/kits/kits.service';
import { ProductsService } from 'src/products/products.service';
import { initialData } from 'src/seed/data/seed-data';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,
    private readonly kitsService: KitsService,
  ) {}

  async runSeed() {
    await this.kitsService.deleteAllKits();
    await this.insertNewProducts();
    await this.insertNewKits();
    return true;
  }

  private async insertNewProducts() {
    await this.productsService.deleteAllProducts();
    const seedProducts = initialData.products;
    const insertPromises: Promise<void>[] = [];
    seedProducts.forEach((product) => {
      if (product) {
        insertPromises.push(
          this.productsService.create(product) as Promise<void>,
        );
      }
    });

    await Promise.all(insertPromises);
  }

  private async insertNewKits() {
    const products = await this.productsService.findAll();
    if (!products?.length) throw new Error('Products not found');
    const seedKits = initialData.kits;
    const insertPromises: Promise<void>[] = [];
    seedKits.forEach((kit) => {
      if (kit) {
        insertPromises.push(this.kitsService.create(kit) as Promise<void>);
      }
    });

    await Promise.all(insertPromises);
  }
}
