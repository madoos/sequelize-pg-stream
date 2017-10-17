'use strict'

module.exports = {
  releaseConnection
}

function releaseConnection (connectionManager, connection) {
  return connectionManager.releaseConnection(connection)
}
