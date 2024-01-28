export function setDateToSearch(day, month) {
    const currentDate = new Date();
    currentDate.setFullYear(currentDate.getFullYear()); // Define o ano para o ano atual
    currentDate.setMonth(month); // Define o mês para janeiro (0, já que janeiro é 0 em JavaScript)
    currentDate.setDate(day); // Define o dia para 1
    currentDate.setHours(0, 0, 0, 0); // Define a hora, minuto, segundo e milissegundo para 0
    return currentDate;
}