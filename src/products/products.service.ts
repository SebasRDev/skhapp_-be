import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from 'src/products/dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { DataSource, Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    private readonly dataSource: DataSource,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);
      return product;
    } catch (error) {
      this.handleException(error);
    }
  }

  async findAll() {
    try {
      return await this.productRepository.find();
    } catch (error) {
      this.handleException(error);
    }
  }

  async findOne(term: string) {
    let prod: Product | null = null;
    if (isUUID(term)) {
      prod = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('product');
      prod = await queryBuilder
        .where(`UPPER(code) =:code;`, {
          code: term.toUpperCase(),
        })
        .getOne();
    }
    if (!prod) throw new NotFoundException('Product not found');

    return prod;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id,
      ...updateProductDto,
    });

    if (!product) throw new NotFoundException('Product not found');

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleException(error);
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    if (product) {
      await this.productRepository.remove(product);
    }
  }

  private handleException(error: any) {
    const errorCode = (error as { code?: string }).code;
    const errorDetail = (error as { detail?: string }).detail;
    if (errorCode === '23505') throw new BadRequestException(errorDetail);
    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check the logs');
  }
}
