export function getCookie(key: string){
    const c = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
    return c ? c.pop() : "";
}

export function getCurrency(price: number){
    return "$" + (price / 100).toFixed(2);
}

export class Constants {
    static readonly pendingAddItem = "pendingAddItem";
    static readonly idle = "idle";
    static readonly pendingRemoveItem = "pendingRemoveItem";
    static readonly pendingFetchProducts = "pendingFetchProducts";
    static readonly pendingFetchProduct = "pendingFetchProduct";
    static readonly pendingFetchFilters = "pendingFetchFilters";
}