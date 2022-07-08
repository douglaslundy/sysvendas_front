import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { convertToBrlCurrency, getCurrency } from '../../components/helpers/formatt/currency';

function salesPDF(sale) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const { id, sale_date, type_sale, paied, total_sale, client, itens } = sale;

    const title = [
        {

            text: `Relatório da Venda Nº ${id}`,
            fontSize: 18,
            bold: true,
            alignment:'center' ,
            margin: [20, 20, 0, 45] // left, top, right, bottom
        }
    ];

    const company = [
        {

            text: [
                `JR Ferragens - Data : ${sale_date}`
            ],
            fontSize: 12,
            bold: true,
            margin: [2, 10, 2, 5] // left, top, right, bottom
        }
    ];
    const type = [
        {

            text: [
                `Venda - ${type_sale == "in_cash" ? 'A Vista' : 'A Prazo'} / Recebida - ${paied == 'yes' ? 'SIM' : 'NÃO'}`
            ],
            fontSize: 12,
            bold: true,
            margin: [2, 2, 2, 5] // left, top, right, bottom
        }
    ];
    const name = [
        {

            text: [
                `CLIENTE: ${client != null ? client.full_name : 'VENDA NO BALCÃO'}`
            ],
            fontSize: 12,
            bold: true,
            margin: [2, 2, 2, 20] // left, top, right, bottom
        }
    ];


    const dados = itens.map((item) => {
        return [
            { text: getCurrency(item.qtd), fontSize: 9, margin: [0, 2, 0, 2] },
            { text: item.name, fontSize: 9, margin: [0, 2, 0, 2] },
            { text: convertToBrlCurrency(getCurrency(item.item_value)), fontSize: 9, margin: [0, 2, 0, 2] },
            { text: convertToBrlCurrency(getCurrency(item.item_value * item.qtd / 100)), fontSize: 9, margin: [0, 2, 0, 2] }
        ]
    });

    const details = [
        {
            table: {
                headerRows: 1,
                widths: ['8%', '52%', '20%', '20%'],
                body: [
                    [
                        { text: 'Qtd', style: 'tableHeader', fontSize: 10 },
                        { text: 'Descrição', style: 'tableHeader', fontSize: 10 },
                        { text: 'Preço Unitário', style: 'tableHeader', fontSize: 10 },
                        { text: 'Total', style: 'tableHeader', fontSize: 10 }
                    ],
                    ...dados
                ]
            },
            // layout: 'lightHorizontalLines' // headerLineOnly
            layout: 'headerLineOnly'
        }
    ];

    const total = [
        {

            text: [
                `Total: ${convertToBrlCurrency(total_sale)}`
            ],
            fontSize: 14,
            bold: true,
            margin: [2, 20, 2, 20] // left, top, right, bottom
        }
    ];

    function footer(currentPage, pageCount) {
        return [
            {
                text: currentPage + ' / ' + pageCount,
                alignment: 'right',
                fontSize: 9,
                margin: [0, 10, 20, 0] // left, top, right, bottom
            }
        ]
    }


    const definitions = {
        pageSize: 'A4',
        pageMargins: [15, 50, 15, 40],
        header: [title],
        watermark: 'JR Ferragens ',
        // watermark: { text: 'JR Ferragens', color: 'blue', opacity: 0.3, bold: true, italics: false },
        // watermark: { text: 'JR Ferragens', fontSize: 40 },
        // watermark: { text: 'JR Ferragens', angle: 70 },
        content: [company, type, name, details, total],
        footer: footer
    };

    // pdfMake.createPdf(definitions).download();
    pdfMake.createPdf(definitions).print();
    
}

export default salesPDF;