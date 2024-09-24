export interface IBaseResponse<T> {
    IsSuccess: boolean;
    Message: string;
    Data: T;
    Errors: unknown[];
}
