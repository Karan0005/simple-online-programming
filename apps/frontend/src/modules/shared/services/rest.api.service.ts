import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';
import { CONFIG } from '../../../config/config';

@Injectable({
    providedIn: 'root'
})
export class RestApiService {
    private readonly apiBaseURL: string = CONFIG.apiUrl;
    private readonly httpOptions: HttpHeaders = new HttpHeaders({
        'Content-Type': 'application/json'
    });

    constructor(private readonly http: HttpClient) {}

    async get<Res>(apiRoute: string): Promise<Res> {
        return firstValueFrom(
            this.http.get<Res>(this.apiBaseURL + apiRoute, {
                headers: this.httpOptions,
                withCredentials: true
            })
        );
    }

    async getWithPayload<Req, Res>(apiRoute: string, params?: Req): Promise<Res> {
        if (params) {
            const keys: string[] = Object.keys(params);
            const values: unknown[] = Object.values(params);

            for (const [index, key] of keys.entries()) {
                apiRoute =
                    apiRoute +
                    (index === 0
                        ? `?${key}` + '=' + `${values[index]}`
                        : `&${key}` + '=' + `${values[index]}`);
            }
        }
        return firstValueFrom(
            this.http.get<Res>(this.apiBaseURL + apiRoute, {
                headers: this.httpOptions,
                withCredentials: true
            })
        );
    }

    async getExternal<Res>(apiRoute: string, headers?: HttpHeaders): Promise<Res> {
        return firstValueFrom(this.http.get<Res>(apiRoute, { headers: headers }));
    }

    async post<Req, Res>(apiRoute: string, params?: Req): Promise<Res> {
        return firstValueFrom(
            this.http.post<Res>(this.apiBaseURL + apiRoute, params, {
                headers: this.httpOptions,
                withCredentials: true
            })
        );
    }

    postWithObservable<Req, Res>(apiRoute: string, params?: Req): Observable<Res> {
        return this.http.post<Res>(this.apiBaseURL + apiRoute, params, {
            headers: this.httpOptions,
            withCredentials: true
        });
    }

    async put<Req, Res>(apiRoute: string, params: Req): Promise<Res> {
        return firstValueFrom(
            this.http.put<Res>(this.apiBaseURL + apiRoute, params, {
                headers: this.httpOptions,
                withCredentials: true
            })
        );
    }

    async patch<Req, Res>(apiRoute: string, params: Req): Promise<Res> {
        return firstValueFrom(
            this.http.patch<Res>(this.apiBaseURL + apiRoute, params, {
                headers: this.httpOptions,
                withCredentials: true
            })
        );
    }

    async delete<Req, Res>(apiRoute: string, params: Req): Promise<Res> {
        if (params) {
            const keys: string[] = Object.keys(params);
            const values: unknown[] = Object.values(params);

            for (const [index, key] of keys.entries()) {
                apiRoute =
                    apiRoute +
                    (index === 0
                        ? `?${key}` + '=' + `${values[index]}`
                        : `&${key}` + '=' + `${values[index]}`);
            }
        }
        return firstValueFrom(
            this.http.delete<Res>(this.apiBaseURL + apiRoute, {
                headers: this.httpOptions,
                withCredentials: true
            })
        );
    }
}
