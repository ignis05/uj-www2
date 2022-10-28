import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { CookieService } from 'ngx-cookie-service'
import { BackendService } from 'src/app/services/backend.service'

@Component({
	selector: 'app-admin-panel',
	templateUrl: './admin-panel.component.html',
	styleUrls: ['./admin-panel.component.scss', '../common/header.style.scss'],
})
export class AdminPanelComponent implements OnInit {
	username: string = ''
	userList: any[] = []

	constructor(private backend: BackendService, private router: Router, private cookieService: CookieService) {
		this.getUsersList()
	}

	ngOnInit(): void {
		this.username = this.cookieService.get('username')
	}

	getUsersList() {
		this.backend.getUsers().subscribe((data: any) => {
			if (data?.success) {
				this.userList = data.users
				console.log(this.userList)
			} else {
				console.log(data)
				if (['No token', 'Invalid or expired token'].includes(data?.reason)) {
					this.logOut()
				} else if (['Not an administrator account'].includes(data?.reason)) {
					this.router.navigateByUrl('/main')
				} else window.alert(`Unexpected backend error when fetching posts: ${data.reason}`)
			}
		})
	}

	logOut(): void {
		this.cookieService.deleteAll()
		this.router.navigateByUrl('/login')
	}

	deleteUser(username: string) {
		this.backend.deleteUser(username).subscribe((data: any) => {
			console.log(data)
      this.getUsersList()
		})
	}
}
