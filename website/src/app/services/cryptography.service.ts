import { Injectable } from '@angular/core'
import { argon2id, argon2Verify } from 'hash-wasm'

@Injectable({
	providedIn: 'root',
})
export class CryptographyService {
	constructor() {}

	createPasswordHash(password: string): Promise<string> {
		return new Promise(async (resolve) => {
			const salt = new Uint8Array(16)
			window.crypto.getRandomValues(salt)

			const key = await argon2id({
				password,
				salt, // salt is a buffer containing random bytes
				parallelism: 1,
				iterations: 256,
				memorySize: 512, // use 512KB memory
				hashLength: 32, // output size = 32 bytes
				outputType: 'encoded', // return standard encoded string containing parameters needed to verify the key
			})

			resolve(key)
		})
	}
}
