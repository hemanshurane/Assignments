import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MessageService } from "primeng/api";
import { catchError, Observable, throwError } from "rxjs";

@Injectable()
export class AppHttpInterceptor implements HttpInterceptor{
    constructor(private msgService: MessageService){}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                if(error.status >= 500 || error.status <= 600){
                    this.msgService.add({
                        severity:'error',
                        summary: 'Server Error',
                        detail:'An unexpected error occured, Please try gain later. '
                    });
                } else if(error.status === 401 || error.status === 402){
                   
                    this.msgService.add({
                        severity:'error',
                        summary: 'Server Error',
                        detail:'Something went wrong!, Please try gain later. '
                    });
                } else {
                    this.msgService.add({
                        severity:'warn',
                        summary: 'Application Error',
                        detail: error.message
                    });
                }
                console.log("Error===>", error.message);
                return throwError(() => error);
            })
        )
    }
}