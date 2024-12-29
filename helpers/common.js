import { Dimensions } from "react-native";

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

export const hp = percentage => {
    return (percentage * deviceHeight) / 100;
}

export const wp = percentage => {
    return (percentage * deviceWidth) / 100;
}

export const normalizeToDDMMYYYY = (input) => {
    // Verifica se o input já está no formato ISO
    if (!isNaN(Date.parse(input))) {
        const date = new Date(input);
        return formatToDDMMYYYY(date);
    }

    // Tenta tratar como "DD/MM/YYYY"
    const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = input.match(dateRegex);
    if (match) {
        const [_, day, month, year] = match;
        const date = new Date(`${year}-${month}-${day}T00:00:00`);
        if (!isNaN(date.getTime())) {
            return formatToDDMMYYYY(date);
        }
    }

    throw new Error("Formato de data inválido");
}

// Função auxiliar para formatar a data em DD/MM/AAAA
export const formatToDDMMYYYY = (date) =>  {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês começa do zero
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}