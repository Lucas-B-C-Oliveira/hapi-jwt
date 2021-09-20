const Hapi = require('@hapi/hapi')
const Context = require('./db/strategies/base/contextStrategy')
const MongoDb = require('./db/strategies/mongodb/mongodb')
const HeroSchema = require('./db/strategies/mongodb/schemas/heroesSchema')
const HeroRoutes = require('./routes/heroRoutes')
const Joi = require('joi')

const HapiSwagger = require('hapi-swagger')
const Vision = require('vision')
const Inert = require('inert')

const app = new Hapi.Server({
    port: 5000
})

function mapRoutes(instance, methods) {
    return methods.map(method => instance[method]())
}

async function main() {
    const connection = MongoDb.connect()
    const context = new Context(new MongoDb(connection, HeroSchema))

    const swaggerOptions = {
        info: {
            title: 'API Heroes - #CursoNodeBR',
            version: 'v1.0'
        },
    }

    await app.register([
        Vision,
        Inert,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ])
    app.validator(Joi)

    
    app.route(
        mapRoutes(new HeroRoutes(context), HeroRoutes.methods())
    )

    await app.start()
    console.log("Servidor is Running in port: ", app.info.port)

    return app
}

module.exports = main()