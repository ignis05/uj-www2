import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'

@Injectable({
	providedIn: 'root',
})
export class BackendService {
	constructor(private http: HttpClient) {}

	registerUser(login: string, password: string) {
		return this.http.post('/api/register', { login, password })
	}
}
