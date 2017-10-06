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

const show = (...args) => {
  console.log(...args)
}

example()

async function example () {
  const sequelize = new Sequelize(database, username, password, dbOptions)
  const Items = sequelizePgStream.streamFromModel(sequelize.define(table, schema))
  await sequelize.query(insertItemsQuey)
  await sequelize.sync()

  const itemsStream = await Items.findAllStream({raw: true})

  itemsStream
  .on('data', show)
  .pipe(StringifyStream())
  .on('data', show)
  .pipe(process.stdout)
}
/*
    promosStream
    .include({
        as: 'promoExports',
        model: PromoExports,
        foreignKey: 'promoId',
        options: {
            where: { date: today }
        }
    })
    .include({
        model: Provider,
        foreignKey: 'promoId',
        options: {
            where: { type: 'reports' }
        }
    })
*/
