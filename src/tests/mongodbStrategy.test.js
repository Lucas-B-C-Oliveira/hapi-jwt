const assert = require('assert')
const MongoDb = require('../db/strategies/mongodb/mongodb')
const HeroSchema = require('../db/strategies/mongodb/schemas/heroesSchema')
const Context = require('../db/strategies/base/contextStrategy')

const MOCK_HERO_REGISTER = {
    name: 'Hercules',
    power: 'Strong'
}

const MOCK_HERO_DEFAULT = {
    name: `Spiderman-${Date.now()}`,
    power: 'Super Web'
}

const MOCK_HERO_UPDATE = {
    name: `Roland-${Date.now()}`,
    power: 'gunslinger'
}

let MOCK_HERO_UPDATE_ID = ''

let context = {}

describe('MongoDB Test Suite', function () {

    this.beforeAll(async () => {
        let connection = MongoDb
        connection = MongoDb.connect()
        
        context = new Context(new MongoDb(connection, HeroSchema))

        await context.create(MOCK_HERO_DEFAULT)
        const result = await context.create(MOCK_HERO_UPDATE)
        MOCK_HERO_UPDATE_ID = result._id
    })

    it('Check connection', async () => {
        const result = await context.isConnected()
        console.log('result', result)
        const expected = 'Connected'

        assert.deepStrictEqual(result, expected)
    })

    it('register', async () => {
        const { name, power } = await context.create(MOCK_HERO_REGISTER)
        assert.deepStrictEqual({ name, power }, MOCK_HERO_REGISTER)
    })

    it('listar', async () => {
        const [{ name, power }] = await context.read({ name: MOCK_HERO_DEFAULT.name })
        const result = {
            name, power
        }
        assert.deepStrictEqual(result, MOCK_HERO_DEFAULT)
    })

    it('Update', async () => {
        const result = await context.update(MOCK_HERO_UPDATE_ID, {
            name: 'EndMan'
        })

        assert.deepStrictEqual(result.modifiedCount, 1)
    })

    it('Remove', async () => {
        const result = await context.delete(MOCK_HERO_UPDATE_ID)
        assert.deepStrictEqual(result.deletedCount, 1)
    })

} )