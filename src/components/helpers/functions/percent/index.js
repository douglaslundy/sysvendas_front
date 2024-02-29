import { convertPercentToNumeric, setCurrency } from "../../formatt/currency";

export const summedPercentage = (cost_value, sale_value) => {
    cost_value = setCurrency(cost_value);
    sale_value = setCurrency(sale_value);

    const result = (((sale_value - cost_value) / cost_value) * 100);
    return result >= 0 ? result : 0;

}

export const valueSaleSummedFromPercent = (valor_custo, valor_percentual) => {
    valor_custo = setCurrency(valor_custo);

    var lucro = valor_custo * (convertPercentToNumeric(valor_percentual) / 100);

    // Calcula o valor de venda somando o custo com o lucro
    //parseFloat converte a variavel, de foma obrigar o operador + somar ao invez de concactenar
    // setcurrency  esta removendo os simbolos R$ quando vem agregado a variavel valor custo
    var valor_venda = parseFloat(valor_custo) + lucro;

    // Retorna o valor de venda
    return valor_venda;
}

export const discountPercentage = (total_sale, discount) => {    
    
    total_sale = setCurrency(total_sale);
    discount = setCurrency(discount);

    // Calcula a porcentagem do desconto em relação ao total da venda
    var porcentagemDesconto = (discount / total_sale) * 100;

    // Retorna a porcentagem de desconto
    //   console.log(porcentagemDesconto)
    //   return porcentagemDesconto >= 0 && porcentagemDesconto <= 100 ? porcentagemDesconto : 0;
    return porcentagemDesconto >= 0 ? porcentagemDesconto : 0;

}


// cost value = 100 ; percent_value = 20
// 100 - (100 * (20 /100))
export const valueDecrescidFromPercent = (cost_value, percent_value) => {   
    cost_value = setCurrency(cost_value);

    return cost_value - (cost_value * (convertPercentToNumeric(percent_value) / 100));
}




// export const valueDecrescidFromPercent = (cost_value, percent_value) => {
//     return ((setCurrency(cost_value) - (setCurrency(cost_value) * (parseFloat(setCurrency(percent_value) / 100) / 100))) / 100).toFixed(2);
// } 