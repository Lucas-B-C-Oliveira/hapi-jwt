const Hapi = require('@hapi/hapi')
const Context = require('./db/strategies/base/contextStrategy')
const MongoDb = require('./db/strategies/mongodb/mongodb')
const HeroSchema = require('./db/strategies/mongodb/schemas/heroesSchema')
const HeroRoutes = require('./routes/heroRoutes')
const AuthRoutes = require('./routes/authRotes')
const Joi = require('joi')

const HapiSwagger = require('hapi-swagger')
const Vision = require('vision')
const Inert = require('inert')
const JWT_SECRET = 'MY_SECRET_123'
const HapiJwt = require('hapi-auth-jwt2')

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
        HapiJwt,
        Vision,
        Inert,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ])

    app.auth.strategy('jwt', 'jwt', {
        key: JWT_SECRET,
        // options: {
        //     expiresIn: 20
        // }
        validate: (data, request) => {
            return { isValid: true }
        }
    })

    app.auth.default('jwt')
    app.validator(Joi)

    app.route([
            ...mapRoutes(new HeroRoutes(context), HeroRoutes.methods()),
            ...mapRoutes(new AuthRoutes(JWT_SECRET), AuthRoutes.methods())
        ])

    await app.start()
    console.log("Servidor is Running in port: ", app.info.port)

    return app
}

module.exports = main()