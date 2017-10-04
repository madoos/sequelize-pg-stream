'use strict'

const sequelize = require('sequelize')
const { Transform } = require('stream')


module.exports = {
  database: 'test',
  username: 'test',
  password: 'test',
  dbOptions: {
    'host': '0.0.0.0',
    'port': 5432,
    'dialect': 'postgres'
  },
  table: 'items',
  insertItemsQuey: `CREATE TABLE  IF NOT EXISTS items AS
  SELECT
    (random()*1000000)::integer AS n,
    md5(random()::text) AS s
  FROM
    generate_series(1,1000000);`,
  schema: {
    n: sequelize.INTEGER,
    s: {
      type: sequelize.STRING,
      primaryKey: true
    }
  },
  schemaOptions: {
    timestamps: false
  },
  StringifyStream () {
    return new Transform({
      objectMode: true,
      writableObjectMode: true,
      transform: (data, enc, done) => done(null, JSON.stringify(data))
    })
  }
}
