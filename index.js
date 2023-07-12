require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()


const Person = require('./models/person')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

/*
let persons = [
    {
        id: 1,
        name: 'Arto Hellias',
        number: '11356743'
    }, {
        id: 2,
        name: 'Juan perez',
        number: '4765544'
    }, {
        id: 3,
        name: 'Arto Hellias',
        number: '02227665544'
    },{
      id: 4,
      name: 'Claudio',
      number: '0225215544'
  }

]

function obtenerFechaYHoraActual() {
    const fechaHoraActual = new Date();

    const fecha = fechaHoraActual.toLocaleDateString();
    const hora = fechaHoraActual.toLocaleTimeString();

    return `Fecha: ${fecha}, Hora: ${hora}`;
}
let totalPeople = persons.length;
let hora = obtenerFechaYHoraActual();
app.get('/api/info', (req, res) => {
    res.send(`Hay informacion sobre: ${totalPeople} personas, ${hora}`)
})
*/

  app.get('/', (req, res) => {
    res.send('<h1>Inicio de pag</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, res) => {
  Person.findById(request.params.id).then(person => {
    res.json(person)
  })
})


/*app.post('/api/persons', (req, res) => { 
  try {
    const generarId = () => { 
      let id = Math.round(Math.random(1) * 10000) 
      return id 
    } 
    const numberId = generarId() 
    const person = {
        id: numberId,
        name: req.body.name,
        number: req.body.number
    }
    const nameV = person.name 
    const personD = persons.filter(person => person.name == nameV) 

    if (!person.name.trim() || !person.number.trim()) { 
      console.log('Falta nombre o numero') 
      return res.status(400).json({ error: 'Falta nombre o numero' }) 
    } else if (personD.length > 0 ) { 
      console.log('Este nombre ya existe') 
      return res.status(400).json({ error: 'Este nombre ya existe' }) 
    } else { 
      persons = persons.concat(person) 
      res.json(person) 
      console.log('Persona registrada con exito') 
    } 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
})*/
app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({ error: 'name o number undefined' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})


app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next)=>{
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})