import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HowtoComponent } from './howto.component';

const routes: Routes = [
  {
    path: '',
    component: HowtoComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HowtoRoutingModule { }
