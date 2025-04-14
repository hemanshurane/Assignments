import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { API_END_POINTS } from "../constants/app.constants";

@Injectable({
    providedIn: 'root'
})
export class AppConfigService {
    private configSubject = new BehaviorSubject<any>(null);
    constructor(private http: HttpClient){}

    loadAppConfig():Observable<any> {
      return this.http.get(`${API_END_POINTS.BASE_URL}/config`)
    }
    getConfig(): any {
       return this.configSubject.asObservable();
    }

    setConfig(config: any): void {
        this.configSubject.next(config);
    }
    // getEndPoint(key: string): string {
    //     return this.config?.endpoints?.[key] || null
    // }
}