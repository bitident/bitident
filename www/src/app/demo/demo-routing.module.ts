import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DemoComponent } from './demo.component';
import { RequestComponent } from '../request/request.component';

const routes: Routes = [
  {
    path: '',
    component: DemoComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('../login/login.module').then(m => m.LoginModule)
      },
      {
        path: 'howto',
        loadChildren: () => import('../howto/howto.module').then(m => m.HowtoModule)
      },
      {
        path: 'request',
        loadChildren: () => import('../request/request.module').then(m => m.RequestModule)
      },
    ]
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DemoRoutingModule { }
