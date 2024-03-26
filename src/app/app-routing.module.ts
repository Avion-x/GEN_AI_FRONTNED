import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '#', redirectTo: 'login', pathMatch: 'full'
  }, 
  { 
    path: 'login', 
    component:LoginComponent,
  },
  
  { path: 'home', loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule) },
  //  { 
  //   path: 'home', 
  //   component:MsalRedirectComponent,
  // },
  // {
  //   path: 'profile',
  //   component:ProfileComponent
  // },
  // { 
  //   path: 'login-failed', 
  //   component:FailedComponent,
  // },
  // {
  //    path: '**',
  //    component: ErrorComponent
  // }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
