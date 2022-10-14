import { Component, OnInit } from '@angular/core'
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms'
import { BackendService } from 'src/app/services/backend.service'
import { Router } from '@angular/router'
import { CookieService } from 'ngx-cookie-service'
import { CryptographyService } from 'src/app/services/cryptography.service'

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
	registerForm: FormGroup
	registerErrorMessage: string = ''

	constructor(
		private backend: BackendService,
		private router: Router,
		private cookieService: CookieService,
		private crypto: CryptographyService
	) {
		this.registerForm = new FormGroup({
			login: new FormControl('', [Validators.required, Validators.minLength(4)]),
			password: new FormControl('', [Validators.required, Validators.minLength(8)]),
			password2: new FormControl('', [Validators.required, Validators.minLength(8), this.passwordsValidator]),
		})
	}

	ngOnInit(): void {}

	passwordsValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
		let group = control.parent
		if (!group) return null
		let pass = group.get('password')?.value
		let pass2 = group.get('password2')?.value
		return pass === pass2 ? null : { notSame: true }
	}

	getErrorMessage(control: AbstractControl | null) {
		if (!control) return ''
		if (control.hasError('required')) return 'You must enter a value'
		if (control.hasError('minlength')) return 'Value too short'
		if (control.hasError('notSame')) return 'Passwords are not the same'

		return 'unspecified error'
	}

	async register() {
		const login = this.registerForm.get('login')?.value
		const password = this.registerForm.get('password')?.value
		const passwordHash = await this.crypto.createPasswordHash(password)
		this.backend.registerUser(login, passwordHash).subscribe((data: any) => {
			if (data?.success) {
				this.cookieService.set('isLoggedIn', 'true')
				this.cookieService.set('username', login)
				this.router.navigateByUrl('/main')
			} else {
				console.log(data)
				if (data?.reason == 'User exists') this.registerErrorMessage = 'This username is already taken'
				else this.registerErrorMessage = `Login failed due to unexpected error: ${data?.reason}`
			}
		})
	}
}
