import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HowtoComponent } from './howto.component';
import { HowtoRoutingModule } from './howto-routing.module';
import { MaterialModule } from '../material/material.module';



@NgModule({
  declarations: [HowtoComponent],
  imports: [
    CommonModule,
    HowtoRoutingModule,
    MaterialModule,
  ]
})
export class HowtoModule { }
