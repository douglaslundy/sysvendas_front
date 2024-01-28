export function setCurrency(str = '') {
    // Remove todos os pontos e troca vírgula por ponto
    let multiplier = str.toString().replace(/['R$'.]/g, '').replace(',', '.');

    // Garante que multiplier é um número, truncando para duas casas decimais
    let numberValue = parseFloat(multiplier);
    numberValue = Math.floor(numberValue * 100) / 100;

    // Converte para string formatada com duas casas decimais
    let formattedValue = numberValue.toFixed(2);

    // Remove o ponto e converte para inteiro, representando o total em centavos
    return formattedValue.includes('.') ? parseInt(formattedValue.replace('.', '')) : parseInt(formattedValue) * 100;
}

export function getCurrency(str) {
    let divider = (str / 100).toString();
    return divider.replace(".", ",");
}

export function convertToBrlCurrency(str = 0) {
    let number = str.toString().replace(',','.');
    number = parseFloat(number);

    // Arredondando para baixo para duas casas decimais
    number = Math.floor(number * 100) / 100;

    // Convertendo para formato de moeda
    return number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function convertToDecimal(str = 0) {
    const number = str.toString().replace(',','.');
    return parseFloat(number).toFixed(2);

}


// export function setCurrency(str = '') {

//     //remove todos os pontos
//     let multiplier = str.toString().replace(/['R$'.]/g, '');

//     // troca a vergula pelo ponto, afim de transformar em numero monetário
//     multiplier = multiplier.replace(',', '.');

//     //converte em float para utilizar o toFixed de modo que sempre exista 2 decimais, indepentende se o usuario colocou digitos ou nao depois da virgula no input
//     // conversão aqui e realizada em float e nao em int para que nao mperca os digitos depois da virgula
//     multiplier = parseFloat(multiplier).toFixed(2);

//     //testa se tem o . separando as casas decimais, se tiver remove convertendo em inteiro, ou seja total de centavos
//     // se de alguma forma nao veio o . multiplica por 100 para converter em centavos

//     return multiplier.includes('.') ? parseInt(multiplier.replace('.', '')) : parseInt(multiplier) * 100;
//     // return parseInt(multiplier) * 100;
// }

// export function convertToBrlCurrency(str = 0) {
//     const number = str.toString().replace(',','.');
//     return parseFloat(number).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// }