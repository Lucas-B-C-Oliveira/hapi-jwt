const Mongoose = require('mongoose')

Mongoose.connect('mongodb://lucasbcoliveira:minhasenhasecreta@localhost:27017/heroes', 
    { useNewUrlParser: true }, function (error) {
        if(!error) return;
        console.log('Connection fail! ', error)
    })

const connection = Mongoose.connection

connection.once('open', () => console.log('database running!!'))

const heroSchema = new Mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    power: {
        type: String,
        required: true
    },
    insertedAt: {
        type: Date,
        default: new Date()
    }
})
const model = Mongoose.model('heroes', heroSchema)

async function main() {
    const resultRegister = await model.create({
        name: 'Batman',
        power: 'Money'
    })
    console.log('result register', resultRegister)

    const listItems = await model.find()
    console.log('items: ', listItems)
}

main()

