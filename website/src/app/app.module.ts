import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'

import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatButtonModule } from '@angular/material/button'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { CookieService } from 'ngx-cookie-service'

import { AppComponent } from './app.component'
import { AppRoutingModule } from './app-routing.module'
import { RegisterComponent } from './components/register/register.component'
import { LoginComponent } from './components/login/login.component'
import { MainPageComponent } from './components/main-page/main-page.component'
import { CryptographyService } from './services/cryptography.service'
import { PostComponent } from './components/post/post.component'
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component'

@NgModule({
	declarations: [AppComponent, RegisterComponent, LoginComponent, MainPageComponent, PostComponent, AdminPanelComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		NgbModule,
		BrowserAnimationsModule,
		ReactiveFormsModule,
		MatInputModule,
		MatFormFieldModule,
		MatButtonModule,
		HttpClientModule,
		MatIconModule,
	],
	providers: [CookieService, HttpClientModule, CryptographyService],
	bootstrap: [AppComponent],
})
export class AppModule {}
