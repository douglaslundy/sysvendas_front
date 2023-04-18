import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { convertToBrlCurrency, getCurrency } from '../../components/helpers/formatt/currency';
import { parseISO, format } from 'date-fns';

async function salesPDF({ id, created_at, type_sale, paied, total_sale, client, itens, discount }) {
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

    const title = [
        {
            text: `Relatório da Venda Nº ${id}`,
            fontSize: 18,
            bold: true,
            alignment: 'center',
            margin: [20, 20, 0, 45] // left, top, right, bottom
        }
    ];

    const logo = [
        {
            // image: "data:image/png;base64, codigo convertido da imagem em base 64 aqui",
            image: await loadImage('https://sysvendas.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.03233391.png&w=256&q=75'),
            width: 120,
            height: 60,
            margin: [20, 20, 0, 45] // left, top, right, bottom
        },
    ]

    const company = [
        // logo,
        {
            stack: [
                { text: 'CNPJ: 34.498.355/0001-74', fontSize: 12, bold: true },
                { text: 'Tel & WhatsApp: 35 98859-2759', fontSize: 12, bold: true },
                { text: 'E-mail: jrferragens84@gmail.com', fontSize: 12, bold: true },
                { text: `Data da venda: ${created_at && format(parseISO(created_at), 'dd/MM/yyyy HH:mm:ss')}` },
            ],
            fontSize: 12,
            alignment: 'center',
            bold: true,
            margin: [0, -30, 2, 5] // left, top, right, bottom
        }
    ];
    const type = [
        {
            text: [
                `Venda - ${type_sale == "in_cash" ? 'A Vista' : 'A Prazo'} / Recebida - ${paied == 'yes' ? 'SIM' : 'NÃO'}`
            ],
            fontSize: 12,
            bold: true,
            margin: [2, 20, 2, 0] // left, top, right, bottom
        }
    ];
    const name = [
        {
            stack: [
                client != null ?
                    (
                        type_sale != "in_cash" ?
                            (
                                [
                                    { text: `CLIENTE: ${client.full_name}` },
                                    { text: `${client.cpf_cnpj ? client.cpf_cnpj.length > 11 ? + " CNPJ: " : "CPF: " + client.cpf_cnpj + " / Telefone: " + client.phone: ''}` }
                                ]
                            )
                            :
                            { text: `CLIENTE: ${client.full_name}` }
                    )
                    :
                    { text: `CLIENTE: ${client != null ? client.full_name : 'VENDA NO BALCÃO'}` }
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
                `Total: ${convertToBrlCurrency(getCurrency(total_sale))}`,
            ],
            fontSize: 14,
            bold: true,
            margin: [2, 20, 2, 2] // left, top, right, bottom
        }
    ];
    const discountLabel = [
        {

            text: [
                `Desconto: ${convertToBrlCurrency(getCurrency(discount))}`,
            ],
            fontSize: 14,
            color: 'red',
            bold: true,
            margin: [2, 2, 2, 2] // left, top, right, bottom
        }
    ];
    const totalPaied = [
        {

            text: [
                `Total Pago: ${convertToBrlCurrency(getCurrency(total_sale - discount))}`,
            ],
            fontSize: 18,
            bold: true,
            margin: [2, 2, 2, 2] // left, top, right, bottom
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
        content: [company, type, name, details, total, discount > 0 ? [discountLabel, totalPaied] : ''
        ],
        // footer: footer
    };

    pdfMake.createPdf(definitions).print();

}

export default salesPDF;