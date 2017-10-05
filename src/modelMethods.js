'use strict'

const { Transform } = require('stream')
const PgQueryStream = require('pg-query-stream')
const methods = Object.create(null)

methods.findAllStream = findAllStream

module.exports = methods

function findAllStream (options = {}) {
  const connectionManager = this.sequelize.connectionManager
  const QueryGenerator = this.QueryGenerator
  const sql = QueryGenerator.selectQuery(this.tableName, options, this)
  const queryStream = new PgQueryStream(sql)

  const buildModel = new Transform({
    objectMode: true,
    writableObjectMode: true,
    transform: (data, enc, done) => done(null, this.build(data))
  })

  return connectionManager
    .getConnection()
    .then((connection) => {
      return options.raw ? connection.query(queryStream) : connection.query(queryStream).pipe(buildModel)
    })
}
