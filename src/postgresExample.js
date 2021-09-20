//npm install sequelize pg-hstore pg
const Sequelize = require('sequelize')
const driver = new Sequelize(
    'heros',
    'user',
    'senha',
    {
        host: 'localhost',
        dialect: 'postgres',
        quoteIdentifiers: false,
        operatorsAliases: false
    }
)

async function main() {
    const Heroes = driver.define('heroes', {
        id: {
            type: Sequelize.INTEGER,
            required: true,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            required: true
        },
        power: {
            type: Sequelize.STRING,
            required: true
        }
    }, {
        tableName: 'TB_HEROES',
        freezeTableName: false,
        timestamps: false
    })
    await Heroes.sync()
    
    await Heroes.create({
        name: 'Green Lantern',
        power: 'Power of the Ring'
    })

    const result = await Heroes.findAll({
        raw: true,
        attributes: ['name']
    })

    console.log('result', result)

}

main()