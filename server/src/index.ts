import express, { Express } from 'express'

const port = 3000
const app: Express = express()

app.use('/', express.static('../../website/dist'))

app.get('/hello', (req, res) => {
	res.send('Hello World')
})

console.log(`App running on http://localhost:${port}`)
app.listen(port)
