const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://sebasbanga:${password}@cluster0.2alqxve.mongodb.net/Agenda-app?retryWrites=true&w=majority`

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', noteSchema)

if(process.argv.length === 5){
    const name = process.argv[3]
    const number = process.argv[4]
  
    const person = new Person({
        name: name,
        number: Number(number),
    })
  
    person.save().then(result => {
      console.log(`added ${name} number ${number} to phonebook`)
      mongoose.connection.close()
    })
  } else {
    console.log('phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
  }

