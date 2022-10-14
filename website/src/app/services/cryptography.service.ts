import { Injectable } from '@angular/core'
import { argon2id, argon2Verify } from 'hash-wasm'

@Injectable({
	providedIn: 'root',
})
export class CryptographyService {
	constructor() {}

	createPasswordHash(password: string): Promise<string> {
		return new Promise(async (resolve) => {
			const key = await argon2id({
				password,
				salt: Uint8Array.from([2137, 2, 1, 3, 7, 7312, 21372137, 73122137]), // salt is a buffer containing random bytes
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
