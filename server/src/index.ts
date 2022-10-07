import express, { Express } from 'express'

import { DataBaseModule } from './modules/database-module'

const port = 3000
const app: Express = express()
const db = new DataBaseModule()

app.use('/', express.static('../../website/dist'))

app.get('/hello', (req, res) => {
	res.send('Hello World')
})

async function main() {
	await db.open()

	console.log(`App running on http://localhost:${port}`)
	app.listen(port)
}
main()
