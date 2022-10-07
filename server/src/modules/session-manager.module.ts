export class SessionManager {
	sessions: Map<string, string> = new Map()

	/**
	 * Generates token and places it in sessions map
	 * @param login
	 * @returns token
	 */
	createSession(login: string): string {
		let token = this.generateToken()

		this.sessions.set(token, login)

		return token
	}

	/**
	 * Removes session from sessions map
	 * @param tokenToDelete
	 * @returns false if no etry was found, true if it was found and deleted
	 */
	deleteSession(tokenToDelete: string): boolean {
		return this.sessions.delete(tokenToDelete)
	}

	generateToken() {
		return Date.now().toString(16) + '-' + Math.floor(Math.random() * 1024).toString(16)
	}
}
