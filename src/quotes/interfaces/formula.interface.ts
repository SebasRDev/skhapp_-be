interface Report {
  data: Data;
  products: ProductQuote[];
}

export interface Data {
  name: string;
  consultant: string;
  gift?: string;
  recommendation?: string;
  generalDiscount?: number;
}

interface ProductQuote {
  id: string;
  quantity: number;
  discount?: number;
}

export default Report;
