import { Routes } from '@angular/router';
import { MainComponentComponent } from './Component/main-component/main-component.component';
import { OwnerDashboardComponent } from './Component/owner-dashboard/owner-dashboard.component';
import { AdminDashboardComponent } from './Component/admin-dashboard/admin-dashboard.component';
import { CustomersDashboardComponent } from './Component/customers-dashboard/customers-dashboard.component';
import { ProfileComponent } from './Component/customers-dashboard/profile/profile.component';
import { DashboardComponent } from './Component/customers-dashboard/dashboard/dashboard.component';
import { OwnDashboardComponent } from './Component/owner-dashboard/own-dashboard/own-dashboard.component';
import { AdmiDashboardComponent } from './Component/admin-dashboard/admi-dashboard/admi-dashboard.component';
import { authGuard } from './auth.guard';
import { UnauthorizedComponent } from './Component/unauthorized/unauthorized.component';
import { OwnProfileComponent } from './Component/owner-dashboard/own-profile/own-profile.component';
import { AAddvehicleComponent } from './Component/admin-dashboard/a-addvehicle/a-addvehicle.component';
import { ManagevehicleComponent } from './Component/admin-dashboard/managevehicle/managevehicle.component';
import { VehicleAvalibleComponent } from './Component/customers-dashboard/vehicle-avalible/vehicle-avalible.component';
import { BookingPageComponent } from './Component/customers-dashboard/booking-page/booking-page.component';
import { PreviewPageComponent } from './Component/customers-dashboard/preview-page/preview-page.component';
import { MyBookingComponent } from './Component/customers-dashboard/my-booking/my-booking.component';
import { PaymentSuccessComponent } from './Component/customers-dashboard/payment-success/payment-success.component';
import { SecurityRefundComponent } from './Component/customers-dashboard/security-refund/security-refund.component';
import { PaymentDetailsComponent } from './Component/customers-dashboard/payment-details/payment-details.component';
import { ReciptpageComponent } from './Component/customers-dashboard/reciptpage/reciptpage.component';
import { FeedbackpageComponent } from './Component/customers-dashboard/feedbackpage/feedbackpage.component';


export const routes: Routes = [

  {
    path: '', component: MainComponentComponent,
    children: [
      {
        path: '', loadComponent: () => import('./Component/home/home.component').then((m) => m.HomeComponent),
      },

      {
        path: 'booking', loadComponent: () => import('./Component/booking/booking.component').then((m) => m.BookingComponent),
      },

      {
        path: 'about', loadComponent: () => import('./Component/about/about.component').then((m) => m.AboutComponent),
      },

      {
        path: 'contact', loadComponent: () => import('./Component/contact/contact.component').then((m) => m.ContactComponent),
      },

      {
        path: 'login', loadComponent: () => import('./Component/login/login.component').then((m) => m.LoginComponent),
      },

      {
        path: 'signup', loadComponent: () => import('./Component/sign-up/sign-up.component').then((m) => m.SignUpComponent),
      },
      {
        path: 'unauthorized', component: UnauthorizedComponent
      }
    ]
  },

  {
    path: 'customer-dashboard', component: CustomersDashboardComponent,
    canActivate: [authGuard],
    data: { expectedRole: 'Customer' },
    children: [
      { path: '', component: DashboardComponent },
      { path: 'customerProfile', component: ProfileComponent },
      { path: 'vehicleavaliblebooking', loadComponent: () => import('./Component/customers-dashboard/vehicle-avalible/vehicle-avalible.component').then((m) => m.VehicleAvalibleComponent), },

      { path: 'custBookingpage/:id', loadComponent: () => import('./Component/customers-dashboard/booking-page/booking-page.component').then((m) => m.BookingPageComponent), },

      { path: 'previewPage', component: PreviewPageComponent },
      { path: 'MyBooking', component: MyBookingComponent },
      { path: 'paymentsuccess', component: PaymentSuccessComponent },
      { path: 'security-refund', component: SecurityRefundComponent },
      { path: 'paymentDetails', component: PaymentDetailsComponent },
      { path: 'reciptpage', component: ReciptpageComponent },
      { path: 'feedback', component: FeedbackpageComponent }
    ]
  },

  {
    path: 'OwnerVehicle-dashboard', component: OwnerDashboardComponent,
    canActivate: [authGuard],
    data: { expectedRole: 'OwnerVehicle' },
    children: [
      { path: "", component: OwnDashboardComponent },
      { path: "own_Profile", component: OwnProfileComponent }
    ]
  },

  {
    path: 'admin-dashboard', component: AdminDashboardComponent,
    canActivate: [authGuard],
    data: { expectedRole: 'Admin' },
    children: [
      { path: "", component: AdmiDashboardComponent },
      { path: "a_addvehicle", component: AAddvehicleComponent },
      { path: "manageVehicle", component: ManagevehicleComponent }
    ]
  },
];
