import { Content } from 'pdfmake/interfaces';
import Product from 'src/products/interfaces/product.interface';
import { CellConfig } from 'src/quotes/interfaces/quote.interface';
import {
  calculateTotal,
  capitalize,
  currencyFormatter,
} from 'src/quotes/utils/utils';

export const tableReport = (data: Product[], property = 'profesionalPrice') => {
  const formulaProducts = data;

  const total = calculateTotal(formulaProducts, 'profesionalPrice');

  const hasAnyDiscount = formulaProducts.some((product) => product.discount);

  const HeaderCell = (value: string, config?: CellConfig) => {
    const { isLast = false, alignment } = config || {};
    return {
      text: value,
      style: isLast ? 'tableHeaderRight' : 'tableHeader',
      alignment,
    };
  };

  const regularCell = (value: string, config?: CellConfig) => {
    const { isLast = false, alignment, margin } = config || {};
    return {
      text: capitalize(value),
      style: isLast ? 'lastCell' : 'cell',
      alignment,
      margin,
    };
  };

  const getTableHeaders = () => {
    let baseHeaders;
    if (property !== 'profesionalPrice') {
      baseHeaders = [
        HeaderCell('Nombre', { alignment: 'left' }),
        HeaderCell('Fase Tratamiento'),
        HeaderCell('Cant'),
        HeaderCell('Uso'),
      ];
    } else {
      baseHeaders = [
        HeaderCell('Nombre', { alignment: 'left' }),
        HeaderCell('Rendimiento'),
        HeaderCell('Precio Prof.'),
        HeaderCell('Cant'),
      ];
    }

    if (hasAnyDiscount) {
      baseHeaders.push(HeaderCell('Dcto'));
    }

    baseHeaders.push(HeaderCell('Valor', { isLast: true }));
    return baseHeaders;
  };

  const getTableWidths = () => {
    const baseWidths = [200, 'auto', 'auto', 30];
    if (hasAnyDiscount) {
      baseWidths.push('auto');
    }
    baseWidths.push('auto');
    return baseWidths;
  };

  const getProductRow = (product: Product, property: string) => {
    const baseRow = [
      regularCell(product.name, { alignment: 'left' }),
      regularCell(product.phase),
      regularCell(product.time),
      regularCell(product.quantity.toString()),
    ];

    if (hasAnyDiscount) {
      baseRow.push(regularCell(`${product.discount || 0}%`));
    }

    const formattedValue = currencyFormatter.format(Number(product[property]));
    baseRow.push(
      regularCell(formattedValue, {
        isLast: true,
      }),
    );

    return baseRow;
  };

  const getTotalRows = () => {
    const totalColSpan = hasAnyDiscount ? 5 : 4;
    const rows: Content[][] = [];

    const getEmptyCells = (count: number) => {
      return Array(count)
        .fill(null)
        .map(() =>
          regularCell('', {
            alignment: 'center',
            margin: [0, 5],
          }),
        );
    };

    if (hasAnyDiscount) {
      rows.push([
        {
          text: 'SUBTOTAL',
          alignment: 'right',
          colSpan: totalColSpan,
          border: [false, false, false, false],
          style: 'tableHeader',
        } as Content,
        ...getEmptyCells(totalColSpan - 1),
        HeaderCell(currencyFormatter.format(total.subtotal), { isLast: true }),
      ]);
      rows.push([
        {
          text: 'AHORRO',
          alignment: 'right',
          colSpan: totalColSpan,
          border: [false, false, false, false],
          style: 'tableHeader',
        } as Content,
        ...getEmptyCells(totalColSpan - 1),
        HeaderCell(currencyFormatter.format(total.subtotal - total.total), {
          isLast: true,
        }),
      ]);
    }

    rows.push([
      {
        text: 'TOTAL',
        alignment: 'right',
        colSpan: totalColSpan,
        border: [false, false, false, false],
        style: 'tableHeader',
      } as Content,
      ...getEmptyCells(totalColSpan - 1),
      HeaderCell(currencyFormatter.format(total.total), { isLast: true }),
    ]);

    return rows;
  };

  const table: Content = {
    layout: 'lightHorizontalLines',
    table: {
      widths: getTableWidths(),
      headerRows: 1,
      body: [
        getTableHeaders(),
        ...formulaProducts.map((prod) => getProductRow(prod, property)),
        ...getTotalRows(),
      ],
    },
  };

  return table;
};
