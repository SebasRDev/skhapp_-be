import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateKitDto } from './dto/create-kit.dto';
// import { UpdateKitDto } from './dto/update-kit.dto';
import { Kit } from 'src/kits/entities/kit.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { KitProduct } from 'src/kits/entities/kit-product.entity';
import { Repository } from 'typeorm';
import { Product } from 'src/products/entities/product.entity';
import { validate as isUUID } from 'uuid';

@Injectable()
export class KitsService {
  private readonly logger = new Logger('KitsService');

  constructor(
    @InjectRepository(Kit)
    private readonly kitRepository: Repository<Kit>,
    @InjectRepository(Product)
    private readonly productsRespository: Repository<Product>,
    @InjectRepository(KitProduct)
    private readonly kitProductRepository: Repository<KitProduct>,
  ) {}

  async create(createKitDto: CreateKitDto) {
    try {
      const kit = this.kitRepository.create(createKitDto);

      const products = await Promise.all(
        createKitDto.products.map(async (product) => {
          const productDB = await this.productsRespository.findOneBy({
            id: product.id,
          });
          if (!productDB) throw new NotFoundException('Product not found');
          return {
            productDB,
            quantity: product.quantity,
          };
        }),
      );

      kit.kitProducts = products.map((product) => {
        return this.kitProductRepository.create({
          product: product.productDB,
          quantity: product.quantity,
        });
      });

      await this.kitRepository.save(kit);
      return kit;
    } catch (error) {
      this.handleException(error);
    }
  }

  async findAll() {
    return this.kitRepository.find({
      relations: {
        kitProducts: {
          product: true,
        },
      },
    });
  }

  async findOne(term: string) {
    let kit: Kit | null = null;
    if (isUUID(term)) {
      kit = await this.kitRepository.findOne({
        where: { id: term },
        relations: {
          kitProducts: {
            product: true,
          },
        },
      });
    } else {
      const queryBuilder = this.kitRepository.createQueryBuilder('kit');
      kit = await queryBuilder
        .where(`UPPER(name) =:name;`, {
          name: term.toUpperCase(),
        })
        .leftJoinAndSelect('kit.kitProducts', 'kitProduct')
        .getOne();
    }
    if (!kit) throw new NotFoundException('Kit not found');
    return kit;
  }

  async remove(id: string) {
    const kit = await this.findOne(id);
    if (kit) {
      await this.kitRepository.remove(kit);
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
