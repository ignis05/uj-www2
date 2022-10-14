import { ComponentFixture, TestBed } from '@angular/core/testing'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'

import { RegisterComponent } from './register.component'

describe('RegisterComponent', () => {
	let component: RegisterComponent
	let fixture: ComponentFixture<RegisterComponent>
	let httpClient: HttpClient
	let httpTestingController: HttpTestingController

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [RegisterComponent],
			imports: [HttpClientTestingModule],
		}).compileComponents()

		// Inject the http service and test controller for each test
		httpClient = TestBed.get(HttpClient)
		httpTestingController = TestBed.get(HttpTestingController)

		fixture = TestBed.createComponent(RegisterComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it('should create', () => {
		expect(component).toBeTruthy()
	})
})
