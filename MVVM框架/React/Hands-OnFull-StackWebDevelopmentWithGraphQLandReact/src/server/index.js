import path from 'path'
import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import db from './database'
import servicesLoader from './services'
const utils = {
  db
}
const services = servicesLoader(utils)
const root = path.join(__dirname, '../../')
const app = express()

app.use(helmet())
app.use(compression())
app.use(cors())
app.use(helmet.referrerPolicy({ policy: 'same-origin' }))

app.use('/', express.static(path.join(root, 'dist/client')))
app.use('/uploads', express.static(path.join(root, 'uploads')))

const serviceNames = Object.keys(services)
for (let i = 0; i < serviceNames.length; i++) {
  const name = serviceNames[i]
  if (name === 'graphql') {
    services[name].applyMiddleware({ app })
  } else {
    app.use(`/${name}`, services[name])
  }
}

app.get('/', (req, res) => {
  res.sendFile(path.join(root, 'dist/client/index.html'))
})

app.listen(8000, () => {
  console.log('Listening on port 8000')
})
