import { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import { Kit } from 'src/kits/entities/kit.entity';
import Product from 'src/products/interfaces/product.interface';
import { tableReport } from 'src/quotes/documents/table.report';
import { Data } from 'src/quotes/interfaces/formula.interface';
import { formatDate, getImage } from 'src/quotes/utils/utils';

export const formulaReport = (
  quoteInfo: Data,
  formulaProducts: Product[],
  kitData: Kit | null,
): TDocumentDefinitions => {
  const today = new Date();
  const formatedDate = formatDate(today);

  const { name, consultant, gift, recommendation } = quoteInfo;

  const getBenefits: Content[] = formulaProducts.map((product) => [
    {
      table: {
        widths: ['auto', '*', 'auto'],
        body: [
          [
            {
              text: product.name,
              border: [false, false, false, false],
              fillColor: '#D9D9D9',
              bold: true,
              margin: [2, 3],
            },
            {
              text: '',
              fillColor: '#D9D9D9',
            },
            {
              text: product.phase,
              alignment: 'Right',
              fillColor: '#D9D9D9',
              bold: true,
              margin: [2, 3],
            },
          ],
        ],
      },
      layout: 'noBorders',
    },
    {
      text: 'Activos:',
      style: 'BenefitsBody',
      bold: true,
    },
    {
      text: product.actives,
      style: 'BenefitsBody',
    },
    {
      text: 'Propiedades:',
      style: 'BenefitsBody',
      bold: true,
    },
    product.properties.map((prop, idx) => ({
      text: `${idx + 1}. ${prop}`,
      style: 'BenefitsBody',
    })),
    {
      text: '',
      marginTop: 12,
    },
  ]);

  const imageKit = getImage(kitData?.imageLink, 250);
  console.log(imageKit);

  const kitPageContent: Content[] = kitData
    ? [
        // kitData.imageLink
        //   ? {
        //       image: kitData.imageLink,
        //       width: 150,
        //       height: 150,
        //     }
        //   : '',
        {
          text: `${kitData.name}`,
          style: 'title',
          alignment: 'center',
          pageBreak: 'beforeEven',
          marginBottom: 30,
        },
        {
          columnGap: 20,
          columns: [
            [
              {
                marginBottom: 10,
                marginTop: 10,
                table: {
                  widths: ['*'],
                  body: [
                    [
                      {
                        text: 'PRODUCTOS',
                        border: [false, false, false, false],
                        fillColor: '#D9D9D9',
                        bold: true,
                        alignment: 'center',
                        margin: [2, 3],
                      },
                    ],
                  ],
                },
                layout: 'noBorders',
              },
              formulaProducts.map((prod) => ({
                text: `- ${prod.name}`,
                style: 'BenefitsBody',
              })),
              {
                marginBottom: 10,
                marginTop: 10,
                table: {
                  widths: ['*'],
                  body: [
                    [
                      {
                        text: 'TIPS',
                        border: [false, false, false, false],
                        fillColor: '#D9D9D9',
                        alignment: 'center',
                        bold: true,
                        margin: [2, 3],
                      },
                    ],
                  ],
                },
                layout: 'noBorders',
              },
              kitData.tips.map((tip) => ({
                text: `- ${tip}`,
                style: 'BenefitsBody',
              })),
            ],
            [
              {
                marginBottom: 10,
                marginTop: 10,
                table: {
                  widths: ['*'],
                  body: [
                    [
                      {
                        text: 'PROTOCOLOS',
                        border: [false, false, false, false],
                        fillColor: '#D9D9D9',
                        alignment: 'center',
                        bold: true,
                        margin: [2, 3],
                      },
                    ],
                  ],
                },
                layout: 'noBorders',
              },
              kitData.protocol.dia.length > 0
                ? {
                    text: 'DIA',
                    style: 'BenefitsBody',
                  }
                : '',
              kitData.protocol.dia.length > 0
                ? kitData.protocol.dia.map((tip) => ({
                    text: `- ${tip}`,
                    style: 'BenefitsBody',
                  }))
                : [],
              kitData.protocol.noche.length > 0
                ? {
                    text: 'NOCHE',
                    style: 'BenefitsBody',
                  }
                : '',
              kitData.protocol.noche.length > 0
                ? kitData.protocol.noche.map((tip) => ({
                    text: `- ${tip}`,
                    style: 'BenefitsBody',
                  }))
                : [],
            ],
          ],
        },
      ]
    : [];

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
            color: '#eeede7',
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
      tableReport(formulaProducts),
      {
        text: gift ? `Las cortesías por su compra son: ${gift}` : '',
        style: 'body',
        margin: [0, 20],
      },
      {
        text: recommendation
          ? `Recomendaciones:  
            ${recommendation}`
          : '',
        style: 'body',
        pageBreak: 'after',
      },
      { text: 'BENEFICIOS PARA TU PIEL', style: 'title', marginBottom: 10 },
      getBenefits,
      kitPageContent,
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
