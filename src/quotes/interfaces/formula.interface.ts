interface Report {
  data: Data;
  kit: string;
  products: ProductQuote[];
}

export interface Data {
  name: string;
  consultant: string;
  phone?: string;
  id?: string;
  gift?: string;
  city?: string;
  campaign?: string;
  recommendations?: string;
  generalDiscount?: number;
}

interface ProductQuote {
  id: string;
  quantity: number;
  discount?: number;
}

export default Report;
