import { Component, ElementRef } from '@angular/core';
import { AppService } from './services/app.service';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, config, Subscription } from 'rxjs';
import { AppConfigService } from './services/appConfig.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import * as d3 from 'd3';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
  providers:[DialogService]
})
export class AppComponent {
  config: any;
  devices: any
  visible: boolean = false;
  private deviceDetailsSubject = new BehaviorSubject<any>(null);

  deviceDetails: any[] = [];
  subcription = new Subscription();
  ssrsubscription!: Subscription;
  deviceID = null;
  deviceStatus = "";
  svg:any
  constructor( private appService: AppService, private appConfigSvc: AppConfigService, public dialogService: DialogService,
    private el: ElementRef
  ){
    this.appConfigSvc.getConfig().subscribe((config: any) => {
      this.config = config;
      console.log("config---->", config);
    })
  }

  ngOnInit() {
   this.getDevicesData();
  }
  public getDevicesData() {
    this.subcription.add(this.appService.getDevices(this.config.endpoints?.devices).subscribe((devices) => {
      console.log("devices", devices);
      this.devices = devices;
     }, (error) => {
       //error handling
     }))
  }
  showModel(device: any){
    this.visible = true;
    this.ssrsubscription = this.appService.getEventDetails(device,this.config.endpoints?.events).subscribe((data) => {
      this.deviceDetails.push(data);
      this.deviceDetailsSubject.next( this.deviceDetails);
      this.deviceID = this.deviceDetails[this.deviceDetails.length - 1 ].deviceId || null; 
      this.deviceStatus = this.deviceDetails[this.deviceDetails.length - 1 ].status || null; 
    }, (error) => {
      //error handling
    })
    
    this.deviceDetailsSubject.asObservable().subscribe((data) => {
      console.log("deviceDetails=====>", data );
    });


    
  }
  onDialogClose() {
    this.visible = false;
    this.ssrsubscription.unsubscribe();
    this.deviceDetails = [];
    this.deviceDetailsSubject.next([]);
    this.deviceDetailsSubject.closed;
    this.deviceID = null;
    this.deviceStatus = ""
  }
  createChart() {
    const element = this.el.nativeElement.querySelector('.chart-continer');
    this.svg = d3.select(element).append('svg').attr('width', 400).attr('height', 400).append('g')
    .attr('transform', `translate(20,20)`);

    this.svg.append('g').attr('class', 'x-axis').attr('transform', 'translate(0,400)');
    this.svg.append('g').attr('class','y-axis');
  }
  updateChart(){
    const parseTime = d3.timeParse('%Y-%m-%dT%H:%M:%S');
    // const data = this.deviceDetails.map((x) => {
    //   timeStamp: parseTime(x.timeStamp),
    //   value: x.partsPerMinute
    // })
  }
  ngOnDestroy() {
    this.subcription.unsubscribe();
  }
}  
