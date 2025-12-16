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
import { ContactmessaegComponent } from './Component/admin-dashboard/contactmessaeg/contactmessaeg.component';
import { BookingRequestComponent } from './Component/admin-dashboard/booking-request/booking-request.component';
import { RejectedBookingsComponent } from './Component/customers-dashboard/rejected-bookings/rejected-bookings.component';
import { CurrentRidesComponent } from './Component/customers-dashboard/current-rides/current-rides.component';
import { ReturnVehicleComponent } from './Component/admin-dashboard/return-vehicle/return-vehicle.component';
import { HelpComponent } from './Component/help/help.component';
import { FuelDamageReportComponent } from './Component/admin-dashboard/fuel-damage-report/fuel-damage-report.component';
import { SecuritydepositRefaundAdminComponent } from './Component/admin-dashboard/securitydeposit-refaund-admin/securitydeposit-refaund-admin.component';
import { UserFeedbackbyadminComponent } from './Component/admin-dashboard/user-feedbackbyadmin/user-feedbackbyadmin.component';
import { ServiceComponent } from './Component/service/service.component';
import { HelpCustomerDashboardComponent } from './Component/customers-dashboard/help-customer-dashboard/help-customer-dashboard.component';
import { Component } from '@angular/core';
import { DriverProfileComponent } from './Component/Driver-dashboard/driver-profile/driver-profile.component';
import { DriverDashboardComponent } from './Component/Driver-dashboard/driver-dashboard.component';
import { OwnAddvehicleComponent } from './Component/owner-dashboard/own-addvehicle/own-addvehicle.component';
import { MyVehicleComponent } from './Component/owner-dashboard/my-vehicle/my-vehicle.component';
import { VerifyownerComponent } from './Component/admin-dashboard/verifyowner/verifyowner.component';
import { AprovedOwnerComponent } from './Component/admin-dashboard/aproved-owner/aproved-owner.component';
import { SetRentComponent } from './Component/admin-dashboard/set-rent/set-rent.component';
import { ChatOwnerComponent } from './Component/owner-dashboard/chat-owner/chat-owner.component';
import { ChatAdminComponent } from './Component/admin-dashboard/chat-admin/chat-admin.component';
import { OwnerPaymentComponent } from './Component/admin-dashboard/owner-payment/owner-payment.component';
import { PaymentdetailsComponent } from './Component/owner-dashboard/paymentdetails/paymentdetails.component';
import { DriverrequestComponent } from './Component/admin-dashboard/driverrequest/driverrequest.component';
import { VerifiedDriverComponent } from './Component/admin-dashboard/verified-driver/verified-driver.component';
import { OngoingtripComponent } from './Component/admin-dashboard/ongoingtrip/ongoingtrip.component';
import { BokingTripComponent } from './Component/Driver-dashboard/boking-trip/boking-trip.component';
import { CurrentTripComponent } from './Component/Driver-dashboard/current-trip/current-trip.component';
import { ChatDriverComponent } from './Component/Driver-dashboard/chat-driver/chat-driver.component';



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
      },
      { path: 'help', component: HelpComponent },
      { path: 'services', component: ServiceComponent }
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
      { path: 'feedback', component: FeedbackpageComponent },
      { path: 'Rejected_Bookings', component: RejectedBookingsComponent },
      { path: 'Current_Rides', component: CurrentRidesComponent },
      { path: "Helpcustomer", component: HelpCustomerDashboardComponent }
    ]
  },

  {
    path: 'OwnerVehicle-dashboard', component: OwnerDashboardComponent,
    canActivate: [authGuard],
    data: { expectedRole: 'OwnerVehicle' },
    children: [
      { path: "", component: OwnDashboardComponent },
      { path: "own_Profile", component: OwnProfileComponent },
      { path: "own_Addvehicle", component: OwnAddvehicleComponent },
      { path: "Myvehicle", component: MyVehicleComponent },
      { path: "owner-chat", component: ChatOwnerComponent },
      { path: "OwnerPaymentDetails", component: PaymentdetailsComponent }

    ]
  },
  {
    path: 'Driver-dashboard', component: DriverDashboardComponent,
    canActivate: [authGuard],
    data: { expectedRole: 'Driver' },
    children: [
      { path: "driverProfile", component: DriverProfileComponent },
      { path: "BookingTrip", component: BokingTripComponent },
      { path: "Current_Rides", component: CurrentTripComponent },
      { path: "adminChat", component: ChatDriverComponent }


    ]
  },

  {
    path: 'admin-dashboard', component: AdminDashboardComponent,
    canActivate: [authGuard],
    data: { expectedRole: 'Admin' },
    children: [
      // { path: "", component: AdmiDashboardComponent },
      { path: "a_addvehicle", component: AAddvehicleComponent },
      { path: "", component: ManagevehicleComponent },
      { path: 'ContachMeaaage', component: ContactmessaegComponent },
      { path: 'bookingrequest', component: BookingRequestComponent },
      { path: 'Returnvehicle_check', component: ReturnVehicleComponent },
      { path: "Damagecharges", component: FuelDamageReportComponent },
      { path: "securitydepositrefaund", component: SecuritydepositRefaundAdminComponent },
      { path: "Feesback", component: UserFeedbackbyadminComponent },
      { path: "verify-owners", component: VerifyownerComponent },
      { path: 'approve-owner', component: AprovedOwnerComponent },
      { path: "set-rents/:id", component: SetRentComponent },
      { path: "Admin-Chat", component: ChatAdminComponent },
      { path: "pay-owners", component: OwnerPaymentComponent },
      { path: "driverrequest", component: DriverrequestComponent },
      { path: "verify-drivers", component: VerifiedDriverComponent },
      { path: "ongoing-trips", component: OngoingtripComponent }





    ]
  },
];
