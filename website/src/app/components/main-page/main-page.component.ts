import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { CookieService } from 'ngx-cookie-service'

@Component({
	selector: 'app-main-page',
	templateUrl: './main-page.component.html',
	styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent implements OnInit {
	username: string = ''

	constructor(private router: Router, private cookieService: CookieService) {}

	ngOnInit(): void {
		this.username = this.cookieService.get('username')
	}

	logOut(): void {
		this.cookieService.deleteAll()
		this.router.navigateByUrl('/login')
	}
}
