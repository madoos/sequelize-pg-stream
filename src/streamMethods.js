'use strict'

const QueryTransform = require('./QueryTransform')
const PgQueryStream = require('pg-query-stream')
const methods = Object.create(null)

methods.findAllStream = findAllStream

module.exports = methods

function findAllStream (options = {}) {
  const connectionManager = this.sequelize.connectionManager
  const QueryGenerator = this.QueryGenerator
  const sql = QueryGenerator.selectQuery(this.tableName, options, this)
  const queryStream = new PgQueryStream(sql)

  const buildModel = new QueryTransform({
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
