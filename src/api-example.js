const Hapi = require('@hapi/hapi')
const Context = require('./db/strategies/base/contextStrategy')
const MongoDb = require('./db/strategies/mongodb/mongodb')
const HeroSchema = require('./db/strategies/mongodb/schemas/heroesSchema')

const app = new Hapi.Server({
    port: 5000
})

async function main() {
    const connection = MongoDb.connect()
    const context = new Context(new MongoDb(connection, HeroSchema))

    app.route([
        {
            path: '/heroes',
            method: 'GET',
            handler: (request, head) => {
                return context.read()
            }
        }
    ])

    await app.start()
    console.log("Servidor is Running in port: ", app.info.port)
}

main()