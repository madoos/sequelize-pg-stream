
const { Transform } = require('stream')

class Associator extends Transform {

  constructor (options, query) {
    super(options)
    this._options = options
    this.query = query
  }

  include (options) {
    if (Array.isArray(options)) {
      return options
      .map((query) => new Associator(this._options, query))
      .reduce((prev, next) => prev.pipe(next), this)
    }
    return this.pipe(new Associator(this._options, options))
  }

  _getAccessor (ParentModel, ChildModel, method) {
    const accessors = ParentModel.constructor.associations[ChildModel.tableName].accessors
    return accessors[method]
  }

  _associationName (TargetModel, SourceModel) {
    return TargetModel.associations[SourceModel.tableName]['as']
  }

  _modelConstructor (modelInstance) {
    return modelInstance.constructor
  }

  _getPrimaryKey (modelInstance) {
    return this._modelConstructor(modelInstance).primaryKeyField
  }

  _transform (parentInstance, enc, done) {
    const { foreignKey, as, options } = this.query
    const ChildModel = this.query.model
    const asKey = as || this._associationName(this._modelConstructor(parentInstance), ChildModel) || ChildModel.tableName

    options.where[foreignKey] = parentInstance[this._getPrimaryKey(parentInstance)]

    ChildModel.findAll(options)
    .then((models) => {
      parentInstance[asKey] = models
      done(null, parentInstance)
    })
    .catch(done)
  }
}

module.exports = Associator
