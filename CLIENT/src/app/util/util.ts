export function getCookie(key: string){
    const c = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
    return c ? c.pop() : "";
}

export function getCurrency(price: number){
    return "$" + (price / 100).toFixed(2);
}