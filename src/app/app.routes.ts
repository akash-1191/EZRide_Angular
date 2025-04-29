import { Routes } from '@angular/router';
import { MainComponentComponent } from './Component/main-component/main-component.component';
import { UserDashboardComponent } from './Component/user-dashboard/user-dashboard.component';
import { OwnerDashboardComponent } from './Component/owner-dashboard/owner-dashboard.component';
import { AdminDashboardComponent } from './Component/admin-dashboard/admin-dashboard.component';
import { DashboardComponent } from './Component/user-dashboard/dashboard/dashboard.component';
import { ProfileComponent } from './Component/user-dashboard/profile/profile.component';

export const routes: Routes = [

    {
        path: '',
        component: MainComponentComponent, 
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./Component/home/home.component').then((m) => m.HomeComponent),
          },

          {
            path: 'booking',
            loadComponent: () =>
              import('./Component/booking/booking.component').then((m) => m.BookingComponent),
          },

          {
            path: 'about',
            loadComponent: () =>
              import('./Component/about/about.component').then((m) => m.AboutComponent),
          },

          {
            path: 'contact',
            loadComponent: () =>
              import('./Component/contact/contact.component').then((m) => m.ContactComponent),
          }, 

          {
            path: 'login',
            loadComponent: () =>
              import('./Component/login/login.component').then((m) => m.LoginComponent),
          },

          {
            path: 'signup',
            loadComponent: () =>
              import('./Component/sign-up/sign-up.component').then((m) => m.SignUpComponent),
          },
        ]
        },


          {
            path: 'user-dashboard',
            component: UserDashboardComponent,
            children:[
              {path:'',component:DashboardComponent}
            ]
          },

          {
            path: 'owner-dashboard',
            component: OwnerDashboardComponent,
          },
          {
            path: 'admin-dashboard',
            component: AdminDashboardComponent,
          },
];
