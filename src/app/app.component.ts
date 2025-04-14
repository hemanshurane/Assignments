import { Component } from '@angular/core';
import { AppService } from './services/app.service';
import { AsyncPipe } from '@angular/common';
import { config } from 'rxjs';
import { AppConfigService } from './services/appConfig.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'assignment_1';
  constructor( private appService: AppService, private appConfigSvc: AppConfigService){}

  ngOnInit() {
    this.appService.getDevices(this.appConfigSvc.getEndPoint('devices')).subscribe((data) => {
      console.log("Devices Data---->", data);
    })
  }
}  
