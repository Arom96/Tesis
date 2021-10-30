import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OauthGuard } from './guards/oauth.guard';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { MyprofileComponent } from './myprofile/myprofile.component';
import { ViewrequestsComponent } from './viewrequests/viewrequests.component';
import { CoursesComponent } from './courses/courses.component';
import { CategoriesComponent } from './categories/categories.component';
import { CarnetUploadComponent } from './carnet-upload/carnet-upload.component';
import { CategorieViewComponent } from './categorie-view/categorie-view.component';
import { DashboardComponent } from './dashboard/dashboard.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'home', component: HomeComponent},
  { path: 'profile', component: MyprofileComponent},
  { path: 'approval', component: ViewrequestsComponent},
  { path: 'courses', component: CoursesComponent},
  { path: 'categories', component: CategoriesComponent},
  { path: 'carnet-upload', component: CarnetUploadComponent},
  { path: 'category', component: CategorieViewComponent},
  { path: 'dashboard', component: DashboardComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
