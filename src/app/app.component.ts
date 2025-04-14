import { Component } from '@angular/core';
import { AppService } from './services/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'assignment_1';
  constructor( private appService: AppService){
    this.appService.getAppConfig().subscribe((data) => {
      console.log('Data====', data);
    })
  }
}
