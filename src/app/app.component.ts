import { Component, ElementRef } from '@angular/core';
import { AppService } from './services/app.service';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, config, Subscription, switchMap } from 'rxjs';
import { AppConfigService } from './services/appConfig.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import * as d3 from 'd3';
import { MessageService } from 'primeng/api';
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
  loading: boolean = false;
  deviceDetails: any[] = [];
  subcription = new Subscription();
  ssrsubscription!: Subscription;
  deviceID = null;
  deviceStatus = "";
  orderID:any;
  productionState: any;
  productionTarget: any;
  severity:any;
  private width = 700;
  private height = 700;
  private margin = 50;

  public svg: any;
  public svgInner: any;
  public yScale: any;
  public xScale: any;
  public xAxis: any;
  public yAxis: any;
  public lineGroup: any;
  constructor( private appService: AppService, private msgService: MessageService, private appConfigSvc: AppConfigService, public dialogService: DialogService,
    private el: ElementRef
  ){
    this.startLoader(2000);
    this.appConfigSvc.getConfig().subscribe((config: any) => {
      this.config = config;
      console.log("config---->", config);
    })
  }

  ngOnInit() {
   this.getDevicesData();
   this.initializeChart(); 
  }
  public getDevicesData() {
    this.subcription.add(this.appService.getDevices(this.config.endpoints?.devices).subscribe((devices) => {
      console.log("devices", devices);
      this.devices = devices;
     }, (error) => {
      this.msgService.add({
        severity:'error',
        summary: 'Server Error',
        detail:'An unexpected error occured, Please try gain later. '
    });
     }))
  }
  showModel(device: any){
    this.visible = true;
    this.startLoader(3000);
    this.ssrsubscription = this.appService.getEventDetails(device,this.config.endpoints?.events).pipe(
      switchMap((data) => {
        this.deviceDetails.push(data);
        this.deviceDetailsSubject.next( this.deviceDetails);
        this.deviceID = this.deviceDetails[this.deviceDetails.length - 1 ].deviceId || null; 
        this.deviceStatus = this.deviceDetails[this.deviceDetails.length - 1 ].status || null;
       
        this.drawChart();
        return this.appService.getOrderDetails(this.config.endpoints?.order, data.order);
      })
    ).subscribe((order) => {
      this.orderID = order.orderNumber;
      this.productionState = order.productionState;
      this.productionTarget = order.productionTarget;
      console.log("order--->",order);
    }, (error) => {
      this.msgService.add({
        severity:'error',
        summary: 'Server Error',
        detail:'An unexpected error occured, Please try gain later. '
    });
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
  private initializeChart(): void {
    const element = this.el.nativeElement.querySelector('.chart-container');
    const parseTime = d3.timeParse('%Y-%m-%dT%H:%M:%S');
    const data = this.deviceDetails.map((d) => ({
      timestamp: parseTime(d.timestamp),
      value: d.partsPerMinute
    }))
    this.svg = d3
      .select( this.el.nativeElement)
      .select('.linechart')
      .append('svg')
      .attr('height', this.height);
    this.svgInner = this.svg
      .append('g')
      .style('transform', 'translate(' + this.margin + 'px, ' + this.margin + 'px)');

    this.yScale = d3
      .scaleLinear()
      .domain([d3.max(data, d => d.value) + 1, d3.min(data, d => d.value) - 1])
      .range([0, this.height - 2 * this.margin]);

    this.yAxis = this.svgInner
      .append('g')
      .attr('id', 'y-axis')
      .style('transform', 'translate(' + this.margin + 'px,  0)');

    this.xScale = d3.scaleTime().domain(d3.extent(data, (d) => d.timestamp) as [Date, Date]);

    this.xAxis = this.svgInner
      .append('g')
      .attr('id', 'x-axis')
      .style('transform', 'translate(0, ' + (this.height - 2 * this.margin) + 'px)');

    this.lineGroup = this.svgInner
      .append('g')
      .append('path')
      .attr('id', 'line')
      .style('fill', 'none')
      .style('stroke', 'red')
      .style('stroke-width', '2px')
  }

  private drawChart(): void {
    const element = this.el.nativeElement.querySelector('.chart-container');
    this.width = this.el.nativeElement.getBoundingClientRect().width;
    this.svg.attr('width', this.width);

    this.xScale.range([this.margin, this.width - 2 * this.margin]);

    const xAxis = d3
      .axisBottom(this.xScale)
      .ticks(5)
      .tickFormat(d3.timeFormat('%H:%M').toString);

    this.xAxis.call(xAxis);

    const yAxis = d3
      .axisLeft(this.yScale);

    this.yAxis.call(yAxis);

    const line = d3
      .line()
      .x(d => d[0])
      .y(d => d[1])
      .curve(d3.curveMonotoneX);
      const parseTime = d3.timeParse('%Y-%m-%dT%H:%M:%S');
      const data = this.deviceDetails.map((d) => ({
        timestamp: parseTime(d.timestamp),
        value: d.partsPerMinute
      }))
    const points: [number, number][] = data.map(d => [
      this.xScale(d.timestamp),
      this.yScale(d.value),
    ]);

    this.lineGroup.attr('d', line(points));
  }
  startLoader(time: number){
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
    },time)
  }
  ngOnDestroy() {
    this.subcription.unsubscribe();
  }
}  
