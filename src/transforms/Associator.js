
const { Transform } = require('stream')

class Associator extends Transform {

  constructor (options, query) {
    super(options)
    this._options = options
    this.query = query
  }

  include (query) {
    return this.pipe(new Associator(this._options, query))
  }

  _getAccessor (ParentModel, ChildModel, method) {
    const accessors = ParentModel.constructor.associations[ChildModel.tableName].accessors
    return accessors[method]
  }

  _modelAlias (ParentModel, ChildModel) {
    return ParentModel.constructor.associations[ChildModel.tableName]['as']
  }

  _transform (ParentModel, enc, done) {
    const { where, as } = this.query
    const ChildModel = this.query.model
    const getter = this._getAccessor(ParentModel, ChildModel, 'get')
    const asKey = as || this._modelAlias(ParentModel, ChildModel) || ChildModel.tableName

    ParentModel[getter](where)
    .then((models) => {
      ParentModel[asKey] = models
      done(null, ParentModel)
    })
    .catch(done)
  }
}

module.exports = Associator
