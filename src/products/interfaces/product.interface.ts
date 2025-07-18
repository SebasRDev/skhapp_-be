interface Product {
  id: string;
  code: string;
  name: string;
  category: string;
  publicPrice?: number | null;
  efficiency?: number | null;
  profesionalPrice: number;
  actives: string;
  properties: string[];
  phase: string;
  time: string;
  quantity: number;
  discount?: number;
  weight?: number;
  image?: string | null;
}

export default Product;
