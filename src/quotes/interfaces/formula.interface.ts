interface FormulaReport {
  data: Data;
  products: ProductQuote[];
}

export interface Data {
  name: string;
  consultant: string;
  gift?: string;
  recommendation?: string;
}

interface ProductQuote {
  id: string;
  quantity: number;
  discount?: number;
}

export default FormulaReport;
