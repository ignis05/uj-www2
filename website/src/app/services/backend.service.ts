import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Post } from '../models/post.model'

@Injectable({
	providedIn: 'root',
})
export class BackendService {
	constructor(private http: HttpClient) {}

	registerUser(login: string, password: string) {
		return this.http.post('/api/register', { login, password })
	}

	loginUser(login: string, password: string) {
		return this.http.post('/api/login', { login, password })
	}

	getPosts() {
		return this.http.get('/api/posts')
	}

	addPost(post: Post) {
		return this.http.post('/api/posts/add', post)
	}
}
