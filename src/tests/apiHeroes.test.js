const assert = require('assert')
const api = require('../api')

let app = {}
const MOCK_HERO_REGISTER = {
    name: 'Zeus',
    power: 'God of Olympus'
}
const MOCK_INITIAL_HERO = {
    name: 'Aquiles',
    power: 'agility'
}
let mock_id = ''


describe('Heroes API Test Suite', function () {
    this.beforeAll(async () => {
        app = await api

        const result = await app.inject({
            method: 'POST',
            url: '/heroes',
            payload: JSON.stringify(MOCK_INITIAL_HERO)
        })

        const data = JSON.parse(result.payload)
        mock_id = data._id

    })

    it('listar GET - /heroes', async () => {
        const result = await app.inject({
            method: 'GET',
            url: '/heroes?skip=0&limit=10'
        })
        const data = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepStrictEqual(statusCode, 200)
        assert.ok(Array.isArray(data))
    })

    it('Listar GET - /heroes - should only return 10 records', async () => {
        const LIMIT_SIZE = 3

        const result = await app.inject({
            method: 'GET',
            url: `/heroes?skip=0&limit=${LIMIT_SIZE}`
        })

        const data = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepStrictEqual(statusCode, 200)
        assert.ok(data.length === LIMIT_SIZE)

    })

    it('Listar GET - /heroes - Should return an error with incorrect limit', async () => {
        const LIMIT_SIZE = "AEEE"

        const result = await app.inject({
            method: 'GET',
            url: `/heroes?skip=0&limit=${LIMIT_SIZE}`
        })

        const statusCode = result.statusCode
        const errorResult = {"statusCode":400,"error":"Bad Request","message":"child \"limit\" fails because [\"limit\" must be a number]","validation":{"source":"query","keys":["limit"]}}


        assert.deepStrictEqual(statusCode, 400)
        assert.deepStrictEqual(result.payload, JSON.stringify(errorResult))

    })

    it('Listar GET - /heroes - Must filter an item', async () => {
        const NAME = MOCK_INITIAL_HERO.name

        const result = await app.inject({
            method: 'GET',
            url: `/heroes?skip=0&limit=1000&name=${NAME}`
        })

        const data = JSON.parse(result.payload)
        const statusCode = result.statusCode

        assert.deepStrictEqual(statusCode, 200)
        assert.deepStrictEqual(data[0].name, NAME)

    })

    it('Register POST - /heroes', async () => {

        const result = await app.inject({
            method: 'POST',
            url: `/heroes`,
            payload: MOCK_HERO_REGISTER
        })

        const statusCode = result.statusCode
        const { message, _id } = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.notStrictEqual(_id, undefined)
        assert.deepStrictEqual(message, "Hero registered successfully!!!")

    })

    it('Update PATCH - /heroes/:id', async () => {
        const _id = mock_id
        const expected = {
            power: 'Battle Winner'
        }

        const result = await app.inject({
            method: 'PATCH',
            url: `/heroes/${_id}`,
            payload: JSON.stringify(expected)
        })

        const statusCode = result.statusCode
        const data = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.deepStrictEqual(data.message, 'Hero successfully updated')
    })

    it('Update PATCH - /heroes/:id - Must not update with incorrect ID', async () => {
        const _id = `6144a82e2b3528f9d41155f3`

        const result = await app.inject({
            method: 'PATCH',
            url: `/heroes/${_id}`,
            payload: {
                power: 'Battle Winner'
            }
        })

        const statusCode = result.statusCode
        const data = JSON.parse(result.payload)
        const expected = {
            statusCode: 412,
            error: 'Precondition Failed',
            message: 'Id not found in data base'
        }

        assert.ok(statusCode === 412)
        assert.deepStrictEqual(data, expected)
    })

    it('Remove DELETE - /heroes/:id', async () => {
        const _id = mock_id
        const result = await app.inject({
            method: 'DELETE',
            url: `/heroes/${_id}`
        })

        const statusCode = result.statusCode
        const data = JSON.parse(result.payload)

        assert.ok(statusCode === 200)
        assert.deepStrictEqual(data.message, 'Hero successfully removed')
    })

    it('Remove DELETE - /heroes/:id Should not remove', async () => {
        const _id = '6144a82e2b3528f9d41155f3'
        const result = await app.inject({
            method: 'DELETE',
            url: `/heroes/${_id}`
        })

        const statusCode = result.statusCode
        const data = JSON.parse(result.payload)
        const expected = {
            statusCode: 412,
            error: 'Precondition Failed',
            message: 'Id not found in data base'
          }

        assert.ok(statusCode === 412)
        assert.deepStrictEqual(data, expected)
    })

    it('Remove DELETE - /heroes/:id Should not remove with invalid id', async () => {
        const _id = 'INVALID_ID'
        const result = await app.inject({
            method: 'DELETE',
            url: `/heroes/${_id}`
        })

        const statusCode = result.statusCode
        const data = JSON.parse(result.payload)
        const expected = {
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'An internal server error occurred'
          }

        assert.ok(statusCode === 500)
        assert.deepStrictEqual(data, expected)
    })

})