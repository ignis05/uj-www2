import express, { Express } from 'express'
import bodyParser from 'body-parser'

import { DataBaseModule } from './modules/database.module'
import { SessionManager } from './modules/session-manager.module'

const port = 3000
const app: Express = express()
const db = new DataBaseModule()
const sm = new SessionManager()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
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
	if (user) return res.status(400).send({ success: false, reason: 'User exists' })

	let success = await db.registerUser({ login: data.login, password: data.password })
	if (!success) return res.status(500).send({ success: false, reason: 'Failed to register' })

	let token = sm.createSession(data.login)

	res.status(201).cookie('token', token, { maxAge: 900000, httpOnly: true }).send({ success: true, token: token })
})

async function main() {
	await db.open()

	console.log(`App running on http://localhost:${port}`)
	app.listen(port)
}
main()
