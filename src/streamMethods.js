'use strict'

const PgQueryStream = require('pg-query-stream')
const Builder = require('./transforms/Builder')
const methods = Object.create(null)

methods.findAllStream = findAllStream

module.exports = methods

function findAllStream (options = {}) {
  const connectionManager = this.sequelize.connectionManager
  const QueryGenerator = this.QueryGenerator
  const sql = QueryGenerator.selectQuery(this.tableName, options, this)
  const queryStream = new PgQueryStream(sql)

  const buildModel = new Builder({
    objectMode: true,
    writableObjectMode: true
  }, this)

  return connectionManager
    .getConnection()
    .then((connection) => {
      return options.raw ? connection.query(queryStream) : connection.query(queryStream).pipe(buildModel)
    })
}
