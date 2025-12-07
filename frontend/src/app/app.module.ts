import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SummaryComponent } from './summary/summary.component';
import { ReportsComponent } from './reports/reports.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SignupComponent } from './signup/signup.component';
// import { NgChartsModule } from 'ng2-charts'; // Removed to avoid compilation error as it is missing in package.json

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    SummaryComponent,
    ReportsComponent,
    ReportsComponent,
    NavbarComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
