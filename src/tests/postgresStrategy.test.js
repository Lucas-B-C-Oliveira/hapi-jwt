const assert = require('assert')
const Postgres = require('../db/strategies/postgres/postgres')
const HeroSchema = require('../db/strategies/postgres/schemas/heroSchema')
const Context = require('./../db/strategies/base/contextStrategy')


const MOCK_HERO_REGISTER = {
    name: 'Black Hawk',
    power: "Magic Arrow"
}

const MOCK_HERO_UPDATE = {
    name: 'Sandman',
    power: "Perpetual of Dream"
}


let context = {}
describe('Postgres Strategy', function () {
    this.timeout(Infinity)

    this.beforeAll(async function () {
        const connection = await Postgres.connect()
        const model = await Postgres.defineModel(connection, HeroSchema)
        context = new Context(new Postgres(connection, model))
        
        await context.delete()
        await context.create(MOCK_HERO_UPDATE)
    })

    it('PostgresSQL Connection', async function () {
        const result = await context.isConnected()
        assert.equal(result, true)
    })

    it('Register', async function () {
        const result = await context.create(MOCK_HERO_REGISTER)
        delete result.id
        assert.deepStrictEqual(result, MOCK_HERO_REGISTER)
    })

    it('Read', async function () {
        const [result] = await context.read({ name: MOCK_HERO_REGISTER.name})
        delete result.id
        assert.deepStrictEqual(result, MOCK_HERO_REGISTER)
    })

    it('Update', async function () {
        const [itemUpdate] = await context.read({ name: MOCK_HERO_UPDATE.name })
        const newItem = {
            ...MOCK_HERO_UPDATE,
            name: 'Morpheus'
        }

        const [result] = await context.update(itemUpdate.id, newItem)
        assert.deepStrictEqual(result, 1)
        const [itemUpdated] = await context.read({ id: itemUpdate.id })
        assert.deepStrictEqual(itemUpdated.name, newItem.name)
    })

    it('Remove for Id', async function () {
        const [item] = await context.read({})
        const result = await context.delete(item.id)
        assert.deepStrictEqual(result, 1)
    })
})









