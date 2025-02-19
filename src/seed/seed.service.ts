import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from 'src/seed/data/seed-data';

@Injectable()
export class SeedService {
  constructor(private readonly productsService: ProductsService) {}

  async runSeed() {
    await this.insertNewProducts();
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

    return true;
  }
}
