import { TDocumentDefinitions } from 'pdfmake/interfaces';
import Product from 'src/products/interfaces/product.interface';
import { tableReport } from 'src/quotes/documents/table.report';
import { Data } from 'src/quotes/interfaces/formula.interface';
import { formatDate } from 'src/quotes/utils/utils';

export const quoteReport = (
  quoteInfo: Data,
  quoteProducts: Product[],
): TDocumentDefinitions => {
  const today = new Date();
  const formatedDate = formatDate(today);

  const { name, consultant, gift } = quoteInfo;

  const homeProducts = quoteProducts.filter(
    (product) => product.publicPrice !== null,
  );

  const cabineProducts = quoteProducts.filter(
    (product) => product.publicPrice === null,
  );

  return {
    pageMargins: [40, 150, 40, 40],
    background: function () {
      return {
        canvas: [
          {
            type: 'rect',
            x: 0,
            y: 0,
            w: 595.28,
            h: 841.89,
            color: '#e6e2cf',
          },
        ],
      };
    },
    header: {
      height: 150,
      width: 150,
      image: 'src/assets/logo_30_y.png',
      margin: [20, 10],
    },
    content: [
      { text: 'Recomendación de tu profesional', style: 'title' },
      {
        text: `Estimado/a ${name} a continuación ${consultant} especialista Skinhealth te hace la siguiente recomendación`,
        style: 'body',
      },
      tableReport(homeProducts, 'publicPrice'),
      tableReport(cabineProducts),
      {
        text: gift ? `Las cortesías por su compra son: ${gift}` : '',
        style: 'body',
        margin: [0, 20],
      },
    ],
    footer: function () {
      return [
        {
          canvas: [
            {
              type: 'line',
              x1: 40,
              y1: -20,
              x2: 595 - 40,
              y2: -20,
              lineWidth: 1,
              lineColor: '#b1b1b1',
            },
          ],
        },
        {
          text: `Esta cotización es valida hasta ${formatedDate}\n y esta sujeta a disponibilidad de inventario`,
          style: 'footer',
        },
      ];
    },
    styles: {
      header: {
        fontSize: 20,
        bold: true,
        font: 'Swiss-721',
      },
      title: {
        fontSize: 12,
        bold: true,
        font: 'Trajan-Pro',
        alignment: 'center',
        color: '#4b4b4b',
      },
      body: {
        fontSize: 12,
        font: 'Swiss-721',
        color: '#4b4b4b',
        margin: [0, 15],
      },
      tableHeader: {
        bold: true,
        font: 'Swiss-721',
        color: '#4b4b4b',
        fontSize: 12,
        alignment: 'center',
      },
      tableHeaderRight: {
        bold: true,
        font: 'Swiss-721',
        color: '#4b4b4b',
        fontSize: 12,
        alignment: 'right',
      },
      cell: {
        fontSize: 12,
        font: 'Swiss-721',
        color: '#4b4b4b',
        alignment: 'center',
        margin: [0, 5],
      },
      lastCell: {
        color: '#4b4b4b',
        alignment: 'right',
        margin: [0, 5],
      },
      benefitTitle: {
        fontSize: 12,
        bold: true,
        font: 'Swiss-721',
        color: '#4b4b4b',
        margin: [0, 5],
        background: '#D9D9D9',
      },
      BenefitsBody: {
        fontSize: 12,
        font: 'Swiss-721',
        color: '#4b4b4b',
      },
      footer: {
        alignment: 'center',
        fontSize: 10,
        color: '#b1b1b1',
        font: 'Trajan-Pro',
      },
    },
  };
};
