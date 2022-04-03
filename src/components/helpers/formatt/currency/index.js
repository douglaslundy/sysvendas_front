export function setCurrency(str) {

    //remove todos os pontos
    let multiplier = str.replace(/['R$'.]/g, '');

    // troca a vergula pelo ponto, afim de transformar em numero monetário
    multiplier = multiplier.replace(',', '.');

    //converte em float para utilizar o toFixed de modo que sempre exista 2 decimais, indepentende se o usuario colocou digitos ou nao depois da virgula no input
    // conversão aqui e realizada em float e nao em int para que nao mperca os digitos depois da virgula
    multiplier = parseFloat(multiplier).toFixed(2);

    //testa se tem o . separando as casas decimais, se tiver remove convertendo em inteiro, ou seja total de centas
    // se de alguma forma nao veio o . multiplica por 100 para converter em centavos

    return multiplier.includes('.') ? parseInt(multiplier.replace('.', '')) : parseInt(multiplier) * 100;
    // return parseInt(multiplier) * 100;
}


export function getCurrency(str) {
    let divider = (str / 100).toString();
    return divider.replace(".", ",");
}








// function convertBrlCurrency(number) {
//     const a = number.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
//     return a;
// }





// export function setCurrency(str) {
//     let multiplier = str.replace(/['R$'.]/g, '');

//     return multiplier.includes(',') ? parseInt(multiplier.replace(',', '')) : parseInt(multiplier) * 100;
// }


// export function getCurrency(str) {
//     let divider = (str / 100).toString();
//     return divider.replace(".", ",");
// }