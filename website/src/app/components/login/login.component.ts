import { Component, OnInit } from '@angular/core'
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { CookieService } from 'ngx-cookie-service'

import { BackendService } from 'src/app/services/backend.service'
import { CryptographyService } from 'src/app/services/cryptography.service'

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
	loginForm: FormGroup
	loginErrorMessage: string = ''

	constructor(
		private backend: BackendService,
		private router: Router,
		private cookieService: CookieService,
		private crypto: CryptographyService
	) {
		this.loginForm = new FormGroup({
			login: new FormControl('', [Validators.required, Validators.minLength(4)]),
			password: new FormControl('', [Validators.required, Validators.minLength(8)]),
		})
	}

	ngOnInit(): void {}

	getErrorMessage(control: AbstractControl | null) {
		if (!control) return ''
		if (control.hasError('required')) return 'You must enter a value'
		if (control.hasError('minlength')) return 'Value too short'

		return 'unspecified error'
	}

	async signIn() {
		const login = this.loginForm.get('login')?.value
		const password = this.loginForm.get('password')?.value
		const passwordHash = await this.crypto.createPasswordHash(password)
		this.backend.loginUser(login, passwordHash).subscribe((data: any) => {
			if (data?.success) {
				this.cookieService.set('isLoggedIn', 'true')
				this.cookieService.set('username', login)
				this.router.navigateByUrl('/main')
			} else {
				console.log(data)
				if (data?.reason == 'Not exists') this.loginErrorMessage = "User with that username doesn't exist"
				else if (data?.reason == 'Invalid password') this.loginErrorMessage = 'Invalid password'
				else this.loginErrorMessage = `Login failed due to unexpected error: ${data?.reason}`
			}
		})
	}
}
