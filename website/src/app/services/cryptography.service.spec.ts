import { TestBed } from '@angular/core/testing'

import { CryptographyService } from './cryptography.service'

describe('CryptographyService', () => {
	let service: CryptographyService

	beforeEach(() => {
		TestBed.configureTestingModule({})
		service = TestBed.inject(CryptographyService)
	})

	it('should be created', () => {
		expect(service).toBeTruthy()
	})

	it('should have createPasswordHash method', () => {
		expect(typeof service.createPasswordHash === 'function').toBeTruthy()
	})

	it('createPasswordHash should create hashes', async () => {
		const p1 = 'password1'
		const h1 = await service.createPasswordHash(p1)
		const h2 = await service.createPasswordHash(p1)
		console.log(h1)
		console.log(h2)
		expect(service).toBeTruthy()
	})
})
