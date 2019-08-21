import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestComponent } from './request.component';
import { RequestRoutingModule } from './request-routing.module';
import { QRCodeModule } from 'angularx-qrcode';
import { MaterialModule } from '../material/material.module';
import { CountdownModule } from 'ngx-countdown';
import { ClipboardModule } from 'ngx-clipboard';

@NgModule({
  declarations: [RequestComponent],
  imports: [
    CommonModule,
    RequestRoutingModule,
    ClipboardModule,
    CountdownModule,
    QRCodeModule,
    MaterialModule,
  ]
})
export class RequestModule { }
