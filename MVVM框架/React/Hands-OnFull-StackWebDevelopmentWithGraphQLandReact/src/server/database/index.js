import Sequlize from 'sequelize'
import configFile from '../config/'
import models from '../models'

const sequelize = new Sequlize(
  configFile.database,
  configFile.username,
  configFile.password,
  configFile.development
)

const db = {
  models: models(sequelize),
  sequelize
}

export default db
