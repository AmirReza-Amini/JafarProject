export const SetValueLabel = (collection, value, label) => {
    return collection.map(m => {
        return {
            label: m[label],
            value: m[value]
        }
    })
}

export const FormatNumber = (number) => {
    return number ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : number;
}
