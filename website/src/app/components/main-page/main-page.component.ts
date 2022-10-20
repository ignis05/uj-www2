import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { CookieService } from 'ngx-cookie-service'
import { Post } from 'src/app/models/post.model'
import { BackendService } from 'src/app/services/backend.service'

@Component({
	selector: 'app-main-page',
	templateUrl: './main-page.component.html',
	styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent implements OnInit {
	username: string = ''
	posts: Post[] = []

	constructor(private backend: BackendService, private router: Router, private cookieService: CookieService) {}

	ngOnInit(): void {
		this.username = this.cookieService.get('username')

		this.backend.getPosts().subscribe((data: any) => {
			if (data?.success) {
				this.posts = data.posts
			} else {
				console.log(data)
				if (data?.reason == 'No token') {
					this.cookieService.deleteAll()
					this.router.navigateByUrl('/login')
				} else window.alert(`Unexpected backend error when fetching posts: ${data.reason}`)
			}
		})
	}

	trackPost(index: number, post: Post) {
		return post.ID
	}

	logOut(): void {
		this.cookieService.deleteAll()
		this.router.navigateByUrl('/login')
	}
}
