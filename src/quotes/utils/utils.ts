import Product from 'src/products/interfaces/product.interface';

export const formatDate = (date: Date) =>
  date.toLocaleString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

export const currencyFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export const calculateTotal = (
  products: Product[],
  property: string = 'publicPrice',
) => {
  return products.reduce(
    (acc, product) => {
      const productTotal =
        product[property] *
        product?.quantity *
        (1 - (product?.discount || 0) / 100);
      return {
        subtotal: acc?.subtotal + product[property] * product?.quantity,
        total: acc?.total + productTotal,
      };
    },
    { subtotal: 0, total: 0 },
  );
};

export const capitalize = (str: string) => {
  const data = str.split(' ');
  return data
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};
