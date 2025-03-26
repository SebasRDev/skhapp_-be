import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { KitProduct } from './kit-product.entity';

@Entity({ name: 'kits' })
export class Kit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('integer', { nullable: true })
  weight: number;

  @Column('text', { nullable: true })
  category: string;

  @Column('text', { unique: true })
  name: string;

  @Column('integer', { default: 0 })
  price: number;

  @OneToMany(() => KitProduct, (kitProduct) => kitProduct.kit, {
    cascade: true,
    eager: true,
  })
  kitProducts: KitProduct[];

  @Column('text', { array: true, default: [] })
  tips: string[];

  @Column('jsonb', { nullable: false, default: { dia: [], noche: [] } })
  protocol: { dia: string[]; noche: string[] };

  @Column('text', { nullable: true })
  imageLink: string | null;

  @BeforeInsert()
  @BeforeUpdate()
  calculatePrice() {
    if (this.category === 'CASA') {
      this.price =
        this.kitProducts?.reduce((total, kitProduct) => {
          const productPrice = kitProduct.product?.publicPrice ?? 0;
          return total + productPrice * kitProduct.quantity;
        }, 0) || 0;
    } else if (this.category === 'CABINA') {
      this.price =
        this.kitProducts?.reduce((total, kitProduct) => {
          const productPrice = kitProduct.product?.profesionalPrice ?? 0;
          return total + productPrice * kitProduct.quantity;
        }, 0) || 0;
    } else {
      // Default calculation if category is neither CASA nor CABINA
      this.price =
        this.kitProducts?.reduce((total, kitProduct) => {
          const productPrice = kitProduct.product?.publicPrice ?? 0;
          return total + productPrice * kitProduct.quantity;
        }, 0) || 0;
    }
  }
}
