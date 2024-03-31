import axios, { AxiosResponse } from "axios";
import { PaginatedResponse } from "../models/pagination";

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL = 'http://localhost:5000/api';
axios.defaults.withCredentials = true;

const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.response.use(async response => {
    try{
        await sleep(500);
        const pagination = response.headers['pagination'];
        if(pagination){
            response.data = new PaginatedResponse(response.data, JSON.parse(pagination))
            return response;
        }
        return response;
    }
    catch(error){
        console.log(error);
        return await Promise.reject(error);
    }
})

const requests = {
    get: (url: string, params?: URLSearchParams) => axios.get(url, {params}).then(responseBody),
    post: (url: string, body: object) => axios.post(url, body).then(responseBody),
    put: (url: string, body: object) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
}

const Catalog = {
    list: (params: URLSearchParams) => requests.get('products', params),
    details: (id: string) => requests.get(`products/${id}`),
    fetchFilters: () => requests.get('products/filters')
}

const Basket ={
    get: () => requests.get('basket'),
    addItem: (productId: string, quantity = 1) => requests.post(`basket?productId=${productId}&quantity=${quantity}`, {}),
    removeItem: (productId: string, quantity = 1) => requests.delete(`basket?productId=${productId}&quantity=${quantity}`)
}

const agent = {
    Catalog,
    Basket
}

export default agent;