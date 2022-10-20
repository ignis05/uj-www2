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

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use('/', express.static('../../website/dist'))

app.post('/api/login', async (req, res) => {
	let data = req.body
	if (!data.login || !data.password) return res.status(400).send({ success: false, reason: 'Invalid request data' })

	let user = await db.getUser(data.login)
	if (!user) return res.status(200).send({ success: false, reason: 'Not exists' })

	if (user.password != data.password) return res.status(200).send({ success: false, reason: 'Invalid password' })

	let token = sm.createSession(data.login)

	res.status(200).cookie('token', token, { maxAge: 900000, httpOnly: true }).send({ success: true, token: token })
})

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

app.get('/api/posts', async (req, res) => {
	const token = req.cookies.token
	if (!token) return res.status(200).send({ success: false, reason: 'No token' })
	const sessionLogin = sm.sessions.get(token)
	if (!sessionLogin) return res.status(200).send({ success: false, reason: 'Invalid or expired token' })

	const posts = await db.getPosts()
	posts.reverse()
	res.status(200).send({ success: true, posts })
})

app.post('/api/posts/add', async (req, res) => {
	const token = req.cookies.token
	if (!token) return res.status(200).send({ success: false, reason: 'No token' })

	let data = req.body
	if (!data.username || !data.content) return res.status(400).send({ success: false, reason: 'Invalid request data' })

	const sessionLogin = sm.sessions.get(token)
	if (sessionLogin !== data.username) return res.status(400).send({ success: false, reason: 'Token doesnt match username' })

	const post: Post = { username: data.username, content: data.content, date: Date.now(), ID: 0 }

	const result = await db.addPost(post)
	res.status(200).send({ success: result })
})

app.post('/api/posts/update', async (req, res) => {
	const token = req.cookies.token
	if (!token) return res.status(200).send({ success: false, reason: 'No token' })

	let data = req.body
	if (!data.ID || !data.content) return res.status(400).send({ success: false, reason: 'Invalid request data' })

	const sessionLogin = sm.sessions.get(token)
	if (!sessionLogin) return res.status(400).send({ success: false, reason: 'Invalid token' })

	const canEdit: boolean = await db.canEditPost(data.ID, sessionLogin)
	if (!canEdit) return res.status(403).send({ success: false, reason: 'Insufficient permissions to edit other users posts' })

	const result = await db.updatePost(data.ID, data.content)
	res.status(200).send({ success: result })
})

app.post('/api/posts/remove', async (req, res) => {
	const token = req.cookies.token
	if (!token) return res.status(200).send({ success: false, reason: 'No token' })

	let data = req.body
	if (!data.ID) return res.status(400).send({ success: false, reason: 'Invalid request data' })

	const sessionLogin = sm.sessions.get(token)
	if (!sessionLogin) return res.status(400).send({ success: false, reason: 'Invalid token' })

	const canEdit: boolean = await db.canEditPost(data.ID, sessionLogin)
	if (!canEdit) return res.status(403).send({ success: false, reason: 'Insufficient permissions to remove other users posts' })

	const result = await db.removePost(data.ID)
	res.status(200).send({ success: result })
})

async function main() {
	await db.open()

	console.log(`App running on http://localhost:${port}`)
	app.listen(port)
}
main()
