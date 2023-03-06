export interface QueryResponseType extends SuccessfulResponseType {
    metadata: {
        total: number,
        limit: number,
        count: number,
        skip: number,
        page: number,
        sort: string | any,
    }
}

export interface QueryEntityType {
    payload: [] | any[];
    limit: number;
    sort: string | any;
    skip: number;
    total: number;
    length?: number;
}

export interface SuccessfulResponseType {
    success: boolean;
    message: string;
    count?: number;
    payload: [] | any[];
}

export interface FailResponseType {
    success: boolean;
    message: string;
}