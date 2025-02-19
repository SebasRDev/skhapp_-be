import { KitProduct } from 'src/kits/entities/kit-product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  code: string;

  @Column('text', { unique: true })
  name: string;

  @Column('integer', { nullable: true })
  publicPrice: number;

  @Column('integer', { nullable: true })
  efficiency: number;

  @Column('integer')
  profesionalPrice: number;

  @Column('text')
  actives: string;

  @Column('text', { array: true, default: [] })
  properties: string[];

  @Column('text')
  phase: string;

  @Column('text')
  time: string;

  @OneToMany(() => KitProduct, (kitProduct) => kitProduct.product)
  kitProducts: KitProduct[];
}
