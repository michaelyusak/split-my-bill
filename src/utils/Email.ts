export function IsValidEmail(value: string) {
    const rgx = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/g

    return rgx.test(value)
}