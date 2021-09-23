const assert = require('assert')
const PasswordHelper = require('../helpers/passwordHelper')

const password = 'Erick@123321'
const HASH = '$2b$04$.fBwzEGNtqw3XwqFziBWOOq6QTvMWHEZDgS/UVHD4vl0pObQxxdZq'

describe('UserHelper test suite', function () {

    it('deve gerar um hash a partir de uma senha', async () => {
        const result = await PasswordHelper.hashPassword(password)
        assert.ok(result.length > 10)
    })

    it('deve comparar uma senha e seu hash', async () => {
        const result = await PasswordHelper.comparePassword(password, HASH)
        assert.ok(result)
    })
})