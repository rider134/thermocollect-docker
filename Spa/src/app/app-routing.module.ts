import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FacadeControlComponent } from './facade-control/facade-control.component';

const routes: Routes = [
  { path: 'control', component: FacadeControlComponent },
  { path: '', redirectTo: '/control', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
