export function cleanCpfCnpj(str){

    return str.replace(/['/''.'-]/g, "");
}