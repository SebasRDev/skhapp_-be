import { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import { tableReport } from 'src/quotes/documents/table.report';
import FormulaReport from 'src/quotes/interfaces/formula.interface';
import { formatDate } from 'src/quotes/utils/utils';

const formulaProducts = [
  {
    id: '1341142',
    code: 'LL150',
    name: 'ACIDO LACTICO LIMPIADOR X 150 G',
    phase: 'LIMPIEZA',
    time: 'Día o Noche',
    quantity: 100,
    discount: 5,
    publicPrice: 94900,
    profesionalPrice: 74900,
    actives: 'Ácido Láctico 1,1%',
    properties: [
      'Eliminas impurezas y toxinas.',
      'Estabiliza la acidez natural de la piel.//Recomendado para pieles sensibles.',
    ],
  },
  {
    id: '134142',
    code: 'LL151',
    name: 'CREMA NUTRITIVA - AMINO REPAIR COMPLEX X 50 G',
    phase: 'NUTRICIÓN E HIDRTATCIÓN',
    time: 'Día o Noche',
    quantity: 1,
    publicPrice: 132400,
    profesionalPrice: 122400,
    actives: 'Ácido Glicólico 7%, Alantoína 0,2%',
    properties: [
      'limina células muertas mediante un peeling suave.',
      'Devuelve el aspecto juvenil de la piel.',
      'Deja una sensación de tersura y suavidad. // Recomendado para pieles sensibles.',
    ],
  },
  {
    id: '134113',
    code: 'LL152',
    name: 'AGUA VITALIZANTE NATURAL X 120 G',
    phase: 'TÓNICO VITALIZANTE',
    time: 'Día o Noche',
    quantity: 1,
    publicPrice: 77300,
    profesionalPrice: 67300,
    actives: '17 Aminoácidos Esenciales 5%, Rosa Mosqueta 5%',
    properties: [
      'Provee aminoácidos, vitaminas, proteínas y factor humectante.',
      'Compensa la pérdida de nutrientes y favorece la regeneración de la piel.',
      'Revitaliza la células y las estimula para producir colágeno y elastina. // Recomendado para pieles secas.',
    ],
  },
];

export const formulaReport = (
  formulaInfo: FormulaReport,
): TDocumentDefinitions => {
  const today = new Date();
  const formatedDate = formatDate(today);

  const { data } = formulaInfo;
  const { name, consultant, gift } = data;

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
      tableReport(formulaProducts),
      {
        text: `Las cortesías por su compra son: ${gift}`,
        style: 'body',
        margin: [0, 20],
      },
      {
        text: `Recomendaciones:  
        ${'Usar todas las noches antes de mimir'}`,
        style: 'body',
        pageBreak: 'after',
      },
      { text: 'BENEFICIOS PARA TU PIEL', style: 'title', marginBottom: 10 },
      getBenefits,
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
