import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { convertToBrlCurrency, getCurrency } from '../../components/helpers/formatt/currency';
import { parseISO, format } from 'date-fns';

async function salePDF({ id, created_at, updated_at, type_sale, paied = null, total_sale = null, cash = null, card = null, check = null, client, itens, discount = null, obs, user }) {
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

        {
            stack: [
                { text: `--------------------------------------------------------------------------------------------------------------------------------------------------------------------------` },
            ],
            fontSize: 12,
            alignment: 'center',
            margin: [0, 0, 0, 0] // left, top, right, bottom
        },

        {
            stack: [
                { text: `D O C U M E N T O   A U X I L I A R   D E   V E N D A  - ${type_sale === 'budget' ? 'O R Ç A M E N T O' : 'P E D I D O'}`, fontSize: 14 },
                { text: `NÃO É DOCUMENTO FISCAL - NÃO É VÁLIDO COMO GARANTIA DE MERCADORIA`, fontSize: 10, bold: true },
                type_sale === 'budget' ? { text: `ESTE ORÇAMENTO SÓ É VÁLIDO MEDIANTE A DISPONIBILIDADE DO ESTOQUE`, fontSize: 10, bold: true } : '',
                { text: `N. do(a) ${type_sale === 'budget' ? 'orçamento' : 'documento'}: ${id}       -       ${created_at && format(parseISO(created_at), 'dd/MM/yyyy')}       -       ${created_at && format(parseISO(created_at), 'HH:mm:ss')}`, fontSize: 12 },
            ],
            alignment: 'center',
            margin: [0, 0, 0, 0] // left, top, right, bottom
        },

        {
            stack: [
                { text: `--------------------------------------------------------------------------------------------------------------------------------------------------------------------------` },
            ],
            fontSize: 12,
            alignment: 'center',
            margin: [0, 0, 0, 0] // left, top, right, bottom
        }
    ];

    const name = [
        {
            stack: [
                client != null ? ({ text: `CLIENTE: ${client.id} - ${client.full_name}` })
                    : { text: `CLIENTE: VENDA NO BALCÃO` }
            ],
            fontSize: 11,
            bold: true,
            margin: [2, 0, 2, 0] // left, top, right, bottom
        },

        {
            stack: [
                client != null ? ({ text: `${(client.cpf_cnpj != null && client.cpf_cnpj.length > 11 ? " CNPJ: " : "CPF: ") + (client.cpf_cnpj != null ? client.cpf_cnpj : '') + " / Telefone: " + (client.phone != null ? client.phone : '')}` })
                    : { text: `` }
            ],
            fontSize: 11,
            bold: false,
            margin: [2, 0, 2, 0] // left, top, right, bottom
        },

    ];

    const type = [
        {
            text: [
                type_sale === 'budget' &&
                `Este orçamento tem validade de 15 dias`
                ||
                `COND. PAGTO:   ${type_sale == "in_cash" ? 'A Vista' : 'A Prazo'} / ${paied == 'yes' ? 'Recebida' : 'A Receber'}`
            ],
            fontSize: type_sale === 'budget' ? 14 : 11,
            margin: [2, 0, 2, 0] // left, top, right, bottom
        },
        {

            text: [
                paied === 'yes' &&
                `Data do pagamento:   ${updated_at && format(parseISO(updated_at), 'dd/MM/yyyy HH:mm:ss')}` || ''
            ],
            fontSize: type_sale === 'budget' ? 14 : 11,
            margin: [2, 0, 2, 0] // left, top, right, bottom
        },

        {
            stack: [
                { text: `--------------------------------------------------------------------------------------------------------------------------------------------------------------------------` },
            ],
            fontSize: 12,
            alignment: 'center',
            margin: [0, 0, 0, 0] // left, top, right, bottom
        }
    ];

    const dados = itens.map((item) => {
        return [
            { text: item.bar_code, fontSize: 9, margin: [0, 2, 0, 2] },
            {
                stack: [
                    { text: item.name?.toUpperCase(), fontSize: 12, margin: [0, 2, 0, 2] },
                    { text: item.obs?.toUpperCase(), fontSize: 8, margin: [0, 2, 0, 2] }
                ]
            },
            { text: item.qtd, fontSize: 9, margin: [0, 2, 0, 2] },
            { text: convertToBrlCurrency(item.item_value), fontSize: 9, margin: [0, 2, 0, 2] },
            { text: convertToBrlCurrency(item.item_value * item.qtd), fontSize: 9, margin: [0, 2, 0, 2] }
        ]
    });

    const details = [
        {
            table: {
                headerRows: 1,
                widths: ['16%', '42%', '6%', '18%', '18%'],
                body: [
                    [
                        { text: 'Código', style: 'tableHeader', fontSize: 10 },
                        { text: 'Descrição', style: 'tableHeader', fontSize: 10 },
                        { text: 'Qtd', style: 'tableHeader', fontSize: 10 },
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
            stack: [
                { text: `--------------------------------------------------------------------------------------------------------------------------------------------------------------------------` },
            ],
            fontSize: 12,
            alignment: 'center',
            margin: [0, 5, 0, 0] // left, top, right, bottom
        },

        {

            text: [
                `TOTAL: ${convertToBrlCurrency(total_sale)}`,
            ],
            fontSize: 10,
            alignment: 'right',
            bold: true,
            margin: [2, 2, 2, 2] // left, top, right, bottom
        }
    ];
    const discountLabel = [
        {

            text: [
                `DESCONTO: ${convertToBrlCurrency(discount)}`,
            ],
            fontSize: 10,
            alignment: 'right',
            color: 'red',
            bold: true,
            margin: [2, 2, 2, 2] // left, top, right, bottom
        }
    ];

    const vPgt = [
        {

            stack: [
                {text: [`Dinheiro: ${convertToBrlCurrency(cash)} - Cartão: ${convertToBrlCurrency(card)} - Cheque: ${convertToBrlCurrency(check)}:                   Vlr. apurado: ${convertToBrlCurrency(parseFloat(cash)+parseFloat(card)+parseFloat(check))} `]},
                {text: [`Troco: ${convertToBrlCurrency((parseFloat(cash)+parseFloat(card)+parseFloat(check))-(parseFloat(total_sale) - parseFloat(discount)))}`]},
            ],
            fontSize: 10,
            alignment: 'right',
            bold: true,
            margin: discount > 0 ? [2, 10, 2, 2] : [2, -20, 2, 2]// left, top, right, bottom
        }
    ];

    const totalPaied = [
        {

            text: [
                `TOTAL PAGO: ${convertToBrlCurrency((total_sale - discount) > 0 ? total_sale - discount : 0)}`,
            ],
            alignment: 'right',
            fontSize: 12,
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

    const lbObs = [

        {
            stack: [
                { text: `Vendedor.: ${user ? user.id +' - ' + user.name.toUpperCase() : ''}` },
                { text: `Obs.: ${obs ? obs : ''}` },
            ],
            fontSize: 10,
            alignment: 'left',
            margin: [0, discount > 0 ? -45 : -13, 200, 10] // left, top, right, bottom
        }
    ];

    const lbSingn = [

        {
            stack: [
                { text: `------------------------------------------------------------------------` },
            ],
            fontSize: 10,
            alignment: 'center',
            margin: [0, 0, 0, 0] // left, top, right, bottom
        },

        {

            text: [
                `COMPRADOR / RECEBEDOR`,
            ],
            fontSize: 10,
            alignment: 'center',
            margin: [0, 0, 0, 0]  // left, top, right, bottom
        }
    ];

    const definitions = {
        pageSize: 'A4',
        pageOrientation: 'portrait',
        pageMargins: [15, 50, 15, 40],
        header: [logo],
        content: [company, name, type, details, total, discount > 0 ? [discountLabel, totalPaied] : '', lbObs, type_sale == 'in_cash' ? vPgt : 0, lbSingn
        ],
        // footer: footer
    };

    pdfMake.createPdf(definitions).print();

}

export default salePDF;