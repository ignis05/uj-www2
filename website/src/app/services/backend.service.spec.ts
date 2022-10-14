import { TestBed } from '@angular/core/testing'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { HttpClient, HttpErrorResponse } from '@angular/common/http'

import { BackendService } from './backend.service'

describe('BackendService', () => {
	let service: BackendService

	let httpClient: HttpClient
	let httpTestingController: HttpTestingController

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientTestingModule],
		})
		service = TestBed.inject(BackendService)

		// Inject the http service and test controller for each test
		httpClient = TestBed.get(HttpClient)
		httpTestingController = TestBed.get(HttpTestingController)
	})

	it('should be created', () => {
		expect(service).toBeTruthy()
	})
})
