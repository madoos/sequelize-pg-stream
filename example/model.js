'use strict'

const sequelizePgStream = require('../src/sequelizePgStream')
const Sequelize = require('sequelize')

const {
  database,
  username,
  password,
  dbOptions,
  table,
  schema,
  insertItemsQuey,
  StringifyStream
} = require('./common')

example()

async function example () {
  const sequelize = new Sequelize(database, username, password, dbOptions)
  const Items = sequelizePgStream.streamFromModel(sequelize.define(table, schema))
  await sequelize.query(insertItemsQuey)
  await sequelize.sync()

  const itemsStream = await Items.findAllStream()

  itemsStream
  .pipe(StringifyStream())
  .pipe(process.stdout)
}
