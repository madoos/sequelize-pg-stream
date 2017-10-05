
const { Transform } = require('stream')

class QueryTransform extends Transform {

  include (query) {
    return this.pipe(new QueryTransform({
      objectMode: true,
      writableObjectMode: true,
      transform: function (ParentModel, enc, done) {
        const { where, as } = query
        const ChildModel = query.model
        const getter = this._getAccessor(ParentModel, ChildModel, 'get')
        const asKey = as || this._modelAlias(ParentModel, ChildModel) || ChildModel.tableName

        ParentModel[getter](where)
        .then((models) => {
          ParentModel[asKey] = models
          done(null, ParentModel)
        })
        .catch(done)
      }
    }))
  }

  _getAccessor (ParentModel, ChildModel, method) {
    const accessors = ParentModel.constructor.associations[ChildModel.tableName].accessors
    return accessors[method]
  }

  _modelAlias (ParentModel, ChildModel) {
    return ParentModel.constructor.associations[ChildModel.tableName]['as']
  }

  _transform (chunk, enc, cb) {
    cb(null, chunk)
  }
}

module.exports = QueryTransform
