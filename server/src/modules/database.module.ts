import sqlite3 from 'sqlite3'
import fs from 'fs'

import { User } from '../models/user.model'
import { Post } from '../models/post.model'

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
					// --- users table
					db.run(`CREATE TABLE users (
									ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
									login VARCHAR(255) NOT NULL UNIQUE,
									password VARCHAR(255) NOT NULL,
									isAdmin INTEGER(1) DEFAULT "0" NOT NULL
								)`)

					// create admin user (login:administrator, password:administrator)
					db.run(`INSERT INTO users (login,password, isAdmin) VALUES (?,?,?)`, [
						'administrator',
						'$argon2id$v=19$m=512,t=256,p=1$WQIBAweQ6Vk$y0gM1sgewoK1itxLpEm/i3uFxs9WZ3iUo4Z5XVruCxc',
						'1',
					])

					// --- posts table
					db.run(`CREATE TABLE posts (
						ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
						username VARCHAR(255) NOT NULL,
						date INTEGER NOT NULL,
						content VARCHAR(1000) NOT NULL
					)`)

					db.run(`INSERT INTO posts (username, date, content) VALUES (?,?,?)`, [
						'administrator',
						Date.now(),
						'To jest ogłoszenie dministtracyjne',
					])

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
					return resolve(false)
				}
				console.log(`Row was added to the table: ${this.lastID}`)
				resolve(true)
			})
		})
	}

	isAdmin(login: string): Promise<boolean> {
		return new Promise((resolve) => {
			this.db?.get(`SELECT isAdmin FROM users WHERE login=?`, [login], function (err, row) {
				if (err) {
					console.log(err.message)
					return resolve(false)
				}
				return resolve(row.isAdmin == 1)
			})
		})
	}

	getUser(login: string): Promise<User | null> {
		return new Promise((resolve) => {
			this.db?.get(`SELECT login, password FROM users WHERE login=?`, [login], function (err, row) {
				if (err) {
					console.log(err.message)
					return resolve(null)
				}
				return resolve(row)
			})
		})
	}

	getPosts(): Promise<Post[]> {
		return new Promise((resolve) => {
			this.db?.all(`SELECT * FROM posts ORDER BY date DESC LIMIT 10`, function (err, rows) {
				if (err) {
					console.log(err.message)
					return resolve([])
				}
				return resolve(rows)
			})
		})
	}

	canEditPost(id: number, username: string): Promise<boolean> {
		return new Promise(async (resolve) => {
			let isAdmin = await this.isAdmin(username)
			if (isAdmin) return resolve(true)
			this.db?.get(`SELECT username FROM posts WHERE ID=?`, [id], function (err, row) {
				if (err) {
					console.log(err.message)
					return resolve(false)
				}
				return resolve(row.username === username)
			})
		})
	}

	addPost(post: Post): Promise<boolean> {
		return new Promise((resolve) => {
			this.db?.run(`INSERT INTO posts (username, date, content) VALUES (?,?,?)`, [post.username, post.date, post.content], function (err) {
				if (err) {
					console.log(err.message)
					return resolve(false)
				}
				console.log(`Added new post: ${this.lastID}`)
				resolve(true)
			})
		})
	}

	updatePost(id: number, newContent: string): Promise<boolean> {
		return new Promise((resolve) => {
			this.db?.run(`UPDATE posts SET content=? WHERE ID=?`, [newContent, id], function (err) {
				if (err) {
					console.log(err.message)
					return resolve(false)
				}
				console.log(`Updated post: ${id}`)
				resolve(true)
			})
		})
	}

	removePost(id: number): Promise<boolean> {
		return new Promise((resolve) => {
			this.db?.run(`DELETE FROM posts WHERE ID=?`, [id], function (err) {
				if (err) {
					console.log(err.message)
					return resolve(false)
				}
				console.log(`Removed post: ${id}`)
				resolve(true)
			})
		})
	}
}
