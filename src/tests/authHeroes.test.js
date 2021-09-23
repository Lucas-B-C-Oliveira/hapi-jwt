const assert = require('assert')
const api = require('../api')
const Context = require('../db/strategies/base/contextStrategy')
const Postgres = require('../db/strategies/postgres/postgres')
const PostGres = require('../db/strategies/postgres/postgres')
const UserSchema = require('../db/strategies/postgres/schemas/userSchema')


let app = {}
const USER = {
    username: 'xuxadasilva',
    password: '123'
}
const USER_DB = {
    username: USER.username.toLowerCase(),
    password: '$2b$04$fjkEl8VqKjovpdiZ/60liOU0esweWgm2FZ2ZXTdtNiP9.rO.BRIHa'
}

describe('Auth test Suite', function () {
    this.beforeAll(async () => {
        app = await api

        const connectionPostgres = await PostGres.connect()
        const model = await Postgres.defineModel(connectionPostgres, UserSchema)
        const postgres = new Context(new PostGres(connectionPostgres, model))

        await postgres.update(null, USER_DB, true)
    })

    it('Must get a token', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: USER
        })

        const statusCode = result.statusCode
        const data = JSON.parse(result.payload)

        assert.deepStrictEqual(statusCode, 200)
        assert.ok(data.token.length > 10)
    })

    it('deve retornar não autorizado ao tentar obter um login errado', async () => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: {
                username: 'macacosMeMordam',
                password: 'MacacosMeMorderam'
            }
        })

        const statusCode = result.statusCode
        const data = JSON.parse(result.payload)

        assert.deepStrictEqual(statusCode, 401)
        assert.deepStrictEqual(data.error, 'Unauthorized')
    })
})