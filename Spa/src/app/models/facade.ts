export interface Facade{
    id: number;
    name: string;
    facadeId: string;
    angle: number;
    mode: number;
}

export function initFacade(): Facade {
    return {
        id: 0,
        name: '',
        facadeId: '',
        angle: 0,
        mode: 0
    }
}