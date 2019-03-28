import path from 'path'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import compress from 'compress'
const root = path.join(__dirname, '../../')

const app = express()

app.use(helmet())
app.use(compress())
app.use(cors())
app.use(helmet.referrerPolicy({ policy: 'same-origin' }))

app.use('/', express.static(path.join(root, 'dist/client')))
app.use('/uploads', express.static(path.join(root, 'uploads')))
app.get('/', (req, res) => {
  res.sendFile(path.join(root, 'dist/client/index.html'))
})

app.listen(8000, () => {
  console.log('Listening on port 8000')
})
