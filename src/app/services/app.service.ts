import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_END_POINTS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  applicationConfig: any;
  constructor(private http: HttpClient) {
    
  }
   
  public getAppConfig() : Observable<any> {
   return this.http.get(`${API_END_POINTS.BASE_URL}/config`);
  }
  public getDevices(endpoint: string): Observable<any > {
    return this.http.get(`${API_END_POINTS.BASE_URL}${endpoint}`);
  }
  public getEventDetails(id: number): Observable<any> {
    return this.http.get(`${API_END_POINTS.BASE_URL}${this.applicationConfig && this.applicationConfig.endpoints?.events}`);
  }
  public getOrderDetails(orderId: number): Observable<any> {
    return this.http.get(`${API_END_POINTS.BASE_URL}${this.applicationConfig && this.applicationConfig.endpoints?.order}`);
  }
}
