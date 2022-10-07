import sqlite3 from 'sqlite3'
import fs from 'fs'

import { User } from '../models/user.model'

export class DataBaseModule {
	db: sqlite3.Database | null = null

	constructor() {}

	/**
	 * Opens database, creates file if needed
	 * @returns Promise resolved when db is ready to use, true if database existed, false if new one was created
	 */
	open(): Promise<boolean> {
		return new Promise((resolve) => {
			const dbFile = '../database/database.sqlite'
			const dbExists = fs.existsSync(dbFile)

			console.log(`Database exists: `, dbExists)

			if (!dbExists) fs.openSync(dbFile, 'w')

			const db = new sqlite3.Database(dbFile)
			this.db = db

			if (!dbExists) {
				db.serialize(() => {
					db.run(`CREATE TABLE users (
									ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
									login VARCHAR(255) NOT NULL UNIQUE,
									password VARCHAR(255) NOT NULL
								)`)

					resolve(false)
				})
			} else resolve(true)
		})
	}

	close() {
		this.db?.close()
	}

	registerUser(user: User): Promise<boolean> {
		return new Promise((resolve) => {
			this.db?.run(`INSERT INTO users (login,password) VALUES (?,?)`, [user.login, user.password], function (err) {
				if (err) {
					console.log(err.message)
				}
				console.log(`Row was added to the table: ${this.lastID}`)
				resolve(true)
			})
		})
	}
}
