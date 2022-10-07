import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppComponent } from './app.component'
import { AppRoutingModule } from './app-routing.module'
import { RegisterComponent } from './components/register/register.component'
import { LoginComponent } from './components/login/login.component'

@NgModule({
	declarations: [AppComponent, RegisterComponent, LoginComponent],
	imports: [BrowserModule, AppRoutingModule],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
