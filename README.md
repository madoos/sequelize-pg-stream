# sequelize-pg-stream

_Make model classes streamable when using PG, adding `.findAllStream` function._

## Getting Started

To install:

    npm i --save sequelize-pg-stream

Stream support for model:

``` javascript

const Sequelize = require('sequelize')
const sequelizePgStream = require('sequelize-pg-stream')

const sequelize = new Sequelize('database', 'username', 'password', {/*options*/})

const Items = sequelize.define('items',{
  n: sequelize.INTEGER,
  s: {
    type: sequelize.STRING,
    primaryKey: true
})

sequelizePgStream.streamFromModel(Items)

await sequelize.sync()

const itemsStream = await Items.findAllStream()

itemsStream
.on('data', (itemModel) => {
  // do somethings
})
.pipe(/* do somethings */)

```
