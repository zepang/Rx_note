import Sequelize from 'sequelize'
// import requireContext from 'babel-plugin-macros/context'
import logger from '../helpers/logger'

if (process.env.NODE_ENV === 'development') {
  debugger
  logger.log({ level: 'info', message: 'development' })
  const register = require('babel-plugin-require-context-hook/register')
  logger.log({ level: 'info', message: register })
  register()
}

export default (sequelize) => {
  let db = {}

  const context = requireContext(__dirname, '', true, /^\.\/(?!index\.js).*\.js$/)
  console.log(__dirname, context)
  context.keys.forEach(module => {
    const model = module(sequelize, Sequelize)
    db[model.name] = model
  })

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db)
    }
  })

  return db
}
