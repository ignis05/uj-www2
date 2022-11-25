import express, { Express } from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

import { DataBaseModule } from './modules/database.module'
import { SessionManager } from './modules/session-manager.module'
import { Post } from './models/post.model'

const port = 3000
const app: Express = express()
const db = new DataBaseModule()
const sm = new SessionManager()

// data parsers
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

// static serve of dist dir, redirect all SPA links to index
app.use('/', express.static('../../website/dist'))
app.get('/main', (req, res) => res.sendFile('index.html', { root: '../../website/dist/' }))
app.get('/login', (req, res) => res.sendFile('index.html', { root: '../../website/dist/' }))
app.get('/register', (req, res) => res.sendFile('index.html', { root: '../../website/dist/' }))
app.get('/admin', (req, res) => res.sendFile('index.html', { root: '../../website/dist/' }))

// login request handler
app.post('/api/login', async (req, res) => {
	let data = req.body
	if (!data.login || !data.password) return res.status(400).send({ success: false, reason: 'Invalid request data' })

	let user = await db.getUser(data.login)
	if (!user) return res.status(200).send({ success: false, reason: 'Not exists' })

	if (user.password != data.password) return res.status(200).send({ success: false, reason: 'Invalid password' })

	let token = sm.createSession(data.login)

	res.status(200).cookie('token', token, { maxAge: 900000, httpOnly: true }).send({ success: true, token: token })
})

// register request handler
app.post('/api/register', async (req, res) => {
	let data = req.body
	if (!data.login || !data.password) return res.status(400).send({ success: false, reason: 'Invalid request data' })

	let user = await db.getUser(data.login)
	if (user) return res.status(200).send({ success: false, reason: 'User exists' })

	let success = await db.registerUser({ login: data.login, password: data.password })
	if (!success) return res.status(200).send({ success: false, reason: 'Failed to register' })

	let token = sm.createSession(data.login)

	res.status(201).cookie('token', token, { maxAge: 900000, httpOnly: true }).send({ success: true, token: token })
})

// clear session and remove server cookies
app.post('/api/logout', async (req, res) => {
	const token = req.cookies.token
	if (token) sm.sessions.delete(token)

	res.clearCookie('token')

	return res.status(200).send({ success: true })
})

// user list api url
app.get('/api/users', async (req, res) => {
	const token = req.cookies.token
	if (!token) {
		res.clearCookie('token')
		return res.status(200).send({ success: false, reason: 'No token' })
	}
	const sessionLogin = sm.sessions.get(token)
	if (!sessionLogin) {
		res.clearCookie('token')
		return res.status(200).send({ success: false, reason: 'Invalid or expired token' })
	}
	if (sessionLogin != 'administrator') return res.status(200).send({ success: false, reason: 'Not an administrator account' })

	const users = await db.getUsers()
	res.status(200).send({ success: true, users })
})

// post list api url
app.get('/api/posts', async (req, res) => {
	const token = req.cookies.token
	if (!token) {
		res.clearCookie('token')
		return res.status(200).send({ success: false, reason: 'No token' })
	}
	const sessionLogin = sm.sessions.get(token)
	if (!sessionLogin) {
		res.clearCookie('token')
		return res.status(200).send({ success: false, reason: 'Invalid or expired token' })
	}

	const posts = await db.getPosts()
	posts.reverse()
	res.status(200).send({ success: true, posts })
})

// remove user handler
app.post('/api/users/remove', async (req, res) => {
	const token = req.cookies.token
	if (!token) {
		res.clearCookie('token')
		return res.status(200).send({ success: false, reason: 'No token' })
	}

	let data = req.body
	if (!data.username) return res.status(400).send({ success: false, reason: 'Invalid request data' })

	const sessionLogin = sm.sessions.get(token)
	if (!sessionLogin) return res.status(400).send({ success: false, reason: 'Invalid token' })
	if (sessionLogin != 'administrator')
		return res.status(403).send({ success: false, reason: 'Insufficient permissions to remove other users' })

	if (data.username == 'administrator') return res.status(403).send({ success: false, reason: 'Not authorized to remove admin users' })

	const result = await db.removeUser(data.username)
	res.status(200).send({ success: result })
})

// add post handler
app.post('/api/posts/add', async (req, res) => {
	const token = req.cookies.token
	if (!token) {
		res.clearCookie('token')
		return res.status(200).send({ success: false, reason: 'No token' })
	}

	let data = req.body
	if (!data.username || !data.content) return res.status(400).send({ success: false, reason: 'Invalid request data' })

	const sessionLogin = sm.sessions.get(token)
	if (sessionLogin !== data.username) return res.status(400).send({ success: false, reason: 'Token doesnt match username' })

	const post: Post = { username: data.username, content: data.content, date: Date.now(), ID: 0 }

	const result = await db.addPost(post)
	res.status(200).send({ success: result })
})

// update post handler
app.post('/api/posts/update', async (req, res) => {
	const token = req.cookies.token
	if (!token) {
		res.clearCookie('token')
		return res.status(200).send({ success: false, reason: 'No token' })
	}

	let data = req.body
	if (!data.ID || !data.content) return res.status(400).send({ success: false, reason: 'Invalid request data' })

	const sessionLogin = sm.sessions.get(token)
	if (!sessionLogin) return res.status(400).send({ success: false, reason: 'Invalid token' })

	const canEdit: boolean = await db.canEditPost(data.ID, sessionLogin)
	if (!canEdit) return res.status(403).send({ success: false, reason: 'Insufficient permissions to edit other users posts' })

	const result = await db.updatePost(data.ID, data.content)
	res.status(200).send({ success: result })
})

// remove post handler
app.post('/api/posts/remove', async (req, res) => {
	const token = req.cookies.token
	if (!token) {
		res.clearCookie('token')
		return res.status(200).send({ success: false, reason: 'No token' })
	}

	let data = req.body
	if (!data.ID) return res.status(400).send({ success: false, reason: 'Invalid request data' })

	const sessionLogin = sm.sessions.get(token)
	if (!sessionLogin) return res.status(400).send({ success: false, reason: 'Invalid token' })

	const canEdit: boolean = await db.canEditPost(data.ID, sessionLogin)
	if (!canEdit) return res.status(403).send({ success: false, reason: 'Insufficient permissions to remove other users posts' })

	const result = await db.removePost(data.ID)
	res.status(200).send({ success: result })
})

// init db and launch server
async function main() {
	await db.open()

	console.log(`App running on http://localhost:${port}`)
	app.listen(port)
}
main()
