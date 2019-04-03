import Sequlize from 'sequelize'
import configFile from '../config/'
import models from '../models'
const env = process.env.NODE_ENV || 'development'

const sequelize = new Sequlize(
  configFile.database,
  configFile.username,
  configFile.password,
  configFile[env]
)

const db = {
  models: models(sequelize),
  sequelize
}

export default db
