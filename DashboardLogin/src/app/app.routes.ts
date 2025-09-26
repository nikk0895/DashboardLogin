import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { CareerComponent } from './pages/career/career.component';
import { ProductComponent } from './pages/product/product.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AdminLoginComponent } from './pages/adminlogin/adminlogin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { AdminportalComponent } from './pages/adminportal/adminportal.component';
import { AuthGuard } from './guards/auth.guard';


export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, },
  { path: 'about', component: AboutComponent },
  { path: 'career', component: CareerComponent },
  { path: 'product', component: ProductComponent },
  { path: 'contact', component: ContactComponent },
 { path: 'adminlogin', component: AdminLoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'adminportal', component: AdminportalComponent, canActivate: [AuthGuard] },
];
