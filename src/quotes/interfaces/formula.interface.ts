import Product from 'src/products/interfaces/product.interface';

interface FormulaReport {
  data: Data;
  products: Product[];
}

interface Data {
  name: string;
  consultant: string;
}

export default FormulaReport;
