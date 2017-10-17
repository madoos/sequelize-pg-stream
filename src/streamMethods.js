'use strict'

const PgQueryStream = require('pg-query-stream')
const Builder = require('./transforms/Builder')
const { releaseConnection } = require('./utils')
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
      const stream = options.raw ? connection.query(queryStream) : connection.query(queryStream).pipe(buildModel)
      const connectionHandler = options.connectionHandler ? connectionHandler : releaseConnection

      stream
      .on('end', () => connectionHandler(connectionManager, connection))
      .on('finish', () => connectionHandler(connectionManager, connection))

      return stream
    })
}
