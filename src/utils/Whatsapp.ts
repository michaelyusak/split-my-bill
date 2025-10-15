export function IsValidWhatsappNumber(value: string): boolean {
    const rgx = /^(?:\+?[1-9]\d{7,14})$/g

    return rgx.test(value)
}