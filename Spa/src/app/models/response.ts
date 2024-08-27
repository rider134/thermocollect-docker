export interface DataResponse{
    id:number;
    message:string;
}

export function initDataResponse(): DataResponse {
    return {
        id:0,
        message:''
    }
}