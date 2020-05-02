const mongoose = require('mongoose')



if(process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})


const Person = mongoose.model('Person', personSchema)

if(process.argv[3] || process.argv[4]) {
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    person.save().then(response => {
        console.log(`Added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
        mongoose.connection.close()
    })
} else {
    Person.find({}).then(person => {
        person.forEach(personNumber => {
            console.log(`${personNumber.name} ${personNumber.number}`)
        })
        mongoose.connection.close()
    })
}


