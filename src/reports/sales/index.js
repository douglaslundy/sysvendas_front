import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { convertToBrlCurrency, getCurrency } from '../../components/helpers/formatt/currency';
import { parseISO, format } from 'date-fns';

// async function salesPDF({ id, created_at, updated_at, type_sale, paied = null, total_sale = null, client, itens, discount = null, obs, user }) {
async function salesPDF(sales) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;

    const loadImage = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        const base64ImageData = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                resolve(reader.result);
            };
            reader.onerror = reject;
        });
        return base64ImageData;
    };

    // const title = [
    //     {
    //         text: `Relatório da Venda Nº ${id}`,
    //         fontSize: 18,
    //         bold: true,
    //         alignment: 'center',
    //         margin: [20, 20, 0, 45] // left, top, right, bottom
    //     }
    // ];

    const logo = [
        {
            // image: "data:image/png;base64, codigo convertido da imagem em base 64 aqui",
            image: await loadImage('https://sysvendas.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.03233391.png&w=256&q=75'),
            width: 120,
            height: 60,
            alignment: 'center',
            margin: [20, 20, 0, 45] // left, top, right, bottom
        },
    ]

    const company = [
        // logo,
        {
            stack: [
                { text: 'CNPJ: 34.498.355/0001-74 - FONE & ZAP: (35)98859-2759 - EMAIL: jrferragens84@gmail.com' },
            ],
            fontSize: 12,
            alignment: 'center',
            margin: [0, 40, 0, 5] // left, top, right, bottom
        },

    ];

    const dados = sales.map((sale) => {
        return [
            {
                stack: [
                    { text: sale.id, fontSize: 9, margin: [0, 2, 0, 2] },
                    { text: format(parseISO(sale.created_at), 'dd/MM/yyyy HH:mm:ss'), fontSize: 9, margin: [0, 2, 0, 2] }
                ]
            },
            {
                stack: [
                    { text: sale.client && sale.client.full_name ? sale.client.id +' - ' + sale.client.full_name : 'VENDA NO BALCÃO' , fontSize: 9, margin: [0, 2, 0, 2] },
                    { text: sale.user.id +' - ' + sale.user.name, fontSize: 9, margin: [0, 2, 0, 2] },
                ]
            },
            {
                stack: [
                    { text: sale.type_sale === 'in_cash' ? 'A Vista' : 'A Prazo', fontSize: 9, margin: [0, 2, 0, 2] },
                    { text: sale.paied === 'yes' ? format(parseISO(sale.updated_at), 'dd/MM/yyyy HH:mm:ss') : 'Pagamento Pendente' , fontSize: 9, margin: [0, 2, 0, 2] }
                ]
            },
            { text: convertToBrlCurrency(getCurrency(sale.total_sale)), fontSize: 9, margin: [0, 2, 0, 2] },
        ]
    });

    const data = [
        {
            table: {
                headerRows: 1,
                widths: ['20%', '45%', '20%', '15%'],
                body: [
                    [
                        { text: 'Código / Data', style: 'tableHeader', fontSize: 10 },
                        { text: 'Cliente / Vendedor', style: 'tableHeader', fontSize: 10 },
                        { text: 'Venda / Pagamento', style: 'tableHeader', fontSize: 10 },
                        { text: 'Total', style: 'tableHeader', fontSize: 10 },
                    ],
                    ...dados
                ]
            },
            // layout: 'lightHorizontalLines' // headerLineOnly
            // layout: 'headerLineOnly'
            layout: {
				fillColor: function (rowIndex, node, columnIndex) {
					return (rowIndex % 2 === 0) ? '#CCCCCC' : null;
				}
            },fontSize: 12,
            alignment: 'left',
            margin: [0, 0, 0, 0] // left, top, right, bottom
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
        pageOrientation: 'portrait',
        pageMargins: [15, 50, 15, 40],
        header: [logo],
        content: [company, data],
        footer: footer
    };

    pdfMake.createPdf(definitions).print();

}

export default salesPDF;