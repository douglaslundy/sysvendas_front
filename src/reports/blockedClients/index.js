import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { convertToBrlCurrency, getCurrency } from '../../components/helpers/formatt/currency';
import { parseISO, format } from 'date-fns';

async function blockedClientsPdf(clients) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    const currentDate = new Date();
const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()} ${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}:${currentDate.getSeconds().toString().padStart(2, '0')}`;


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
                { text: `Clientes bloqueados - compras vencidas a mais de 45 dias`},
            ],
            fontSize: 12,
            alignment: 'left',
            margin: [0, 10, 0, 5] // left, top, right, bottom
        },

    ];

    const dados = clients.length > 0 && clients.map((cli) => {
        return [
            {
                stack: [
                    { text: cli.id, fontSize: 9, margin: [0, 2, 0, 2] },
                    { text: cli.cpf_cnpj, fontSize: 9, margin: [0, 2, 0, 2] }
                ]
            },
            {
                stack: [
                    { text: cli.full_name.toUpperCase(), fontSize: 9, margin: [0, 2, 0, 2] },
                    // { text: cli.user.id +' - ' + cli.user.name, fontSize: 9, margin: [0, 2, 0, 2] },
                ]
            },
            {
                stack: [
                    { text: convertToBrlCurrency(getCurrency(cli.debit_balance)), fontSize: 9, margin: [0, 2, 0, 2] },
                ]
            },
            { text: cli.phone, fontSize: 9, margin: [0, 2, 0, 2] },
        ]
    });

    const data = dados.length > 0 && [
        {
            table: {
                headerRows: 1,
                widths: ['20%', '45%', '15%', '20%'],
                body: [
                    [
                        { text: 'Código / CPF - CPNJ', style: 'tableHeader', fontSize: 10 },
                        { text: 'Nome', style: 'tableHeader', fontSize: 10 },
                        { text: 'Saldo Devedor', style: 'tableHeader', fontSize: 10 },
                        { text: 'Telefone', style: 'tableHeader', fontSize: 10 },
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

    const dateLabel = [
        {

            text: `Relatório gerado em ${formattedDate}`,
            fontSize: 10,
            alignment: 'right',
            bold: true,
            margin: [2, 10, 2, 2] // left, top, right, bottom
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
        // pageOrientation: 'landscape',
        pageMargins: [15, 50, 15, 40],
        header: [logo],
        content: [company, data, dateLabel],
        footer: footer
    };

    pdfMake.createPdf(definitions).download(`Clientes_bloqueados_em_${formattedDate}`);

}

export default blockedClientsPdf;