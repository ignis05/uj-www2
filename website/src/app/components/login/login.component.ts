import { Component, OnInit } from '@angular/core'
import { FormControl } from '@angular/forms'

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
	login = new FormControl('')
	password = new FormControl('')

	constructor() {}

	ngOnInit(): void {}

	signIn(): void {
		let login = this.login.value
		let password = this.login.value
		console.log(login, password)
	}
}
