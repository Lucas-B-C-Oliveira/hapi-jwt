
// ### Não functionou!
// docker ps
// docker exec -it "b4ea450588f1" mongo -u admin -p senhaadmin --authenticationDatabase heroes
// ### 

/* ### Funcionou!

Pego o nome do Container
docker ps

docker exec -it nomeDoContainer bash

mongo localhost:27017 -u admin -p senhaadmin --authenticationDatabase admin

*/

const { DESCRIBE } = require("sequelize/types/lib/query-types")

// databases
show dbs

// change context for an database
use heroes

// Lembrando que para usar os comandos a baixo, você tem que estar no contexto correto!!! ou seja
// Usar os comando a cima!

// show colections (tables)
show collections

db.heroes.insert({
    name: 'Flash',
    power: 'Speed',
    bithDate: '1998-10-17'
})

db.heroes.find()
db.heroes.pretty()

for (let i = 0; i < 100; i++) {
    db.heroes.insert({
        name: `Clone-${i}`,
        power: `Speed-Lvl:${i}`,
        bithDate: '1998-10-17'
    })
}

db.heroes.count()
db.heroes.findOne()
db.heroes.find().limit(100).sort({ name: -1 })
db.heroes.find({}, { power: 1, _id: 0 })


//Create
db.heroes.insert({
    name: `Clone-${i}`,
    power: `Speed-Lvl:${i}`,
    bithDate: '1998-10-17'
})


// read
db.heroes.find()


// Update
db.heroes.update({ _id: ObjectId("61435d03793d2c4e459d3adb")},
                 { name: "Hackerzaum"})

db.heroes.update({ _id: ObjectId("61435d03793d2c4e459d3ad9")},
                 { $set: {name: "Hackerzaum"} })

// delete
db.heroes.remove({})
db.heroes.remove({ name: "Hackerzaum"}})
