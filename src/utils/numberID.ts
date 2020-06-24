/**
 * Get an ID made out of numbers only
 * 
 * @param length The length of the id
 */
export function numberID(length?: number) {
    let id: string = "";
    if (!length) length = 18;
    for (let i = 0; i < length; i++) {
        id += String(Math.floor(Math.random() * 10));
    }
    return id;
}