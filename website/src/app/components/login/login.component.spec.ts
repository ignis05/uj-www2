import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { ComponentFixture, TestBed } from '@angular/core/testing'

import { LoginComponent } from './login.component'

describe('LoginComponent', () => {
	let component: LoginComponent
	let fixture: ComponentFixture<LoginComponent>

	let httpClient: HttpClient
	let httpTestingController: HttpTestingController

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [LoginComponent],
			imports: [HttpClientTestingModule],
		}).compileComponents()

		// Inject the http service and test controller for each test
		httpClient = TestBed.get(HttpClient)
		httpTestingController = TestBed.get(HttpTestingController)

		fixture = TestBed.createComponent(LoginComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it('should create', () => {
		expect(component).toBeTruthy()
	})
})
