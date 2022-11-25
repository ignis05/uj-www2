import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { CookieService } from 'ngx-cookie-service'
import { Post } from 'src/app/models/post.model'
import { BackendService } from 'src/app/services/backend.service'

@Component({
	selector: 'app-main-page',
	templateUrl: './main-page.component.html',
	styleUrls: ['./main-page.component.scss', '../common/header.style.scss'],
})
export class MainPageComponent implements OnInit {
	username: string = ''
	posts: Post[] = []
	postForm: FormGroup = new FormGroup({
		content: new FormControl('', []),
	})
	interval: NodeJS.Timer | undefined

	constructor(private backend: BackendService, private router: Router, private cookieService: CookieService) {
		this.refreshPosts = this.refreshPosts.bind(this)
	}

	ngOnInit(): void {
		this.username = this.cookieService.get('username')

		this.refreshPosts()

		this.interval = setInterval(this.refreshPosts, 1000) // 1 second
	}

	ngOnDestroy(): void {
		if (this.interval) clearInterval(this.interval)
	}

	refreshPosts() {
		this.backend.getPosts().subscribe((data: any) => {
			if (data?.success) {
				this.posts = data.posts
			} else {
				console.log(data)
				if (['No token', 'Invalid or expired token'].includes(data?.reason)) {
					this.logOut()
				} else window.alert(`Unexpected backend error when fetching posts: ${data.reason}`)
			}
		})
	}

	trackPost(index: number, post: Post) {
		return post.ID
	}

	addPost() {
		const username = this.username
		const content = this.postForm.get('content')?.value
		if (!username || !content) return console.error('no username or login')

		this.backend.addPost({ username, content, date: Date.now(), ID: 0 }).subscribe((data: any) => {
			console.log(data)
			this.refreshPosts()
			this.postForm.setValue({ content: '' })
			this.postForm.markAsUntouched()
		})
	}

	logOut(): void {
		this.backend.logout().subscribe(() => {
			this.cookieService.deleteAll()
			this.router.navigateByUrl('/login')
		})
	}
}
