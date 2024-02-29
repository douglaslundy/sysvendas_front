
export function getCurrency(str = '') {
    return str?.toString().replace(".", ",");
}



export function convertToDecimalWith3DigitsAfterComma(str = 0) {
    const number = str?.toString().replace(',','.');    

    let dotIndex = number.indexOf('.');
    var result = number.slice(0, dotIndex + 4);

    return parseFloat(result).toFixed(3);
}

export function convertToDecimalWith2DigitsAfterComma(str = 0) {
    const number = str?.toString().replace(',','.');    

    let dotIndex = number.indexOf('.');
    var result = number.slice(0, dotIndex + 3);

    return parseFloat(result).toFixed(2);
}

export function setCurrency(str = '') {
    //remove todos os pontos
    let multiplier = str?.toString().replace(/['R$']/g, '');
    
    // troca a vergula pelo ponto, afim de transformar em numero monetário
    multiplier = multiplier.replace(',', '.');
    return multiplier.trim();
}

export function changeDotToComma(str) {
    return str?.toString().replace(".", ",");
}


export function convertToBrlCurrency(str = 0) {
    const number = setCurrency(str).toString().replace(',','.');

    let dotIndex = number.indexOf('.');
    var result = dotIndex > 0 ? number.slice(0, dotIndex + 3) : number;

    return parseFloat(result).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}


export function convertPercentToNumeric (value = '') {
    var per = value?.toString().replace('%', '');
    return per.replace(',', '.');
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