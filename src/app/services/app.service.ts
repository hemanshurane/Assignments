import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { API_END_POINTS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  applicationConfig: any;
  constructor(private http: HttpClient, private zone: NgZone) {
    
  }
   
  public getAppConfig() : Observable<any> {
   return this.http.get(`${API_END_POINTS.BASE_URL}/config`);
  }
  public getDevices(endpoint: string): Observable<any > {
    return this.http.get(`${API_END_POINTS.BASE_URL}${endpoint}`);
  }
  public getEventDetails(id: number,endpoint: string): Observable<any> {
    let replaceEndPoint = endpoint.replace('{deviceId}', id.toString());
    const url = `${API_END_POINTS.BASE_URL}${replaceEndPoint}`;
    return new Observable((observer) => {
      const deviceEvents = new EventSource(url);
      deviceEvents.onmessage = (event) => {
        this.zone.run(() => {
          observer.next(JSON.parse(event.data));
        })
      }
      deviceEvents.onerror = (error) => {
        this.zone.run(() => {
          observer.error(error);
        })
      };

      return () => {
        deviceEvents.close();
      }
    })
    
  }
  public getOrderDetails(orderId: number): Observable<any> {
    return this.http.get(`${API_END_POINTS.BASE_URL}${this.applicationConfig && this.applicationConfig.endpoints?.order}`);
  }

  getDeviceDetails(url: string){
    
  }
}
