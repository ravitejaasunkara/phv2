import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HelperComponent } from './helper/helper.component';

const routes: Routes = [
  {path:'producthelper',component:HelperComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
