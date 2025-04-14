import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }
  public getAppConfig() : Observable<any> {
    return  this.http.get('https://mock-api.assessment.sfsdm.org/config');
  }
}
