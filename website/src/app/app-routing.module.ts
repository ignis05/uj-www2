import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { LoginComponent } from './components/login/login.component'
import { MainPageComponent } from './components/main-page/main-page.component'
import { RegisterComponent } from './components/register/register.component'
import { IsLoggedInGuard } from './guards/is-logged-in.guard'

const routes: Routes = [
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: 'main', component: MainPageComponent, canActivate: [IsLoggedInGuard] },
	{ path: '', redirectTo: '/login', pathMatch: 'full' },
	// { path: '*', redirectTo: '/login', pathMatch: 'full' },
]

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	providers: [IsLoggedInGuard],
	exports: [RouterModule],
})
export class AppRoutingModule {}
