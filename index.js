const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.static('build'))


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
    },

]

function obtenerFechaYHoraActual() {
    const fechaHoraActual = new Date();

    const fecha = fechaHoraActual.toLocaleDateString();
    const hora = fechaHoraActual.toLocaleTimeString();

    return `Fecha: ${fecha}, Hora: ${hora}`;
}

let totalPeople = persons.length;
let hora = obtenerFechaYHoraActual();


morgan.token('body', (req) => {
    return JSON.stringify(req.body);
  });

  app.get('/', (req, res) => {
    res.send('<h1>Inicio de pag</h1>')
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.get('/api/info', (req, res) => {
    res.send(`Hay informacion sobre: ${totalPeople} personas, ${hora}`)

})

app.post('/api/persons', morgan(':date[web] - Request: :body'),(req, res) => {

    const generarId = () => {
        let id = Math.round(Math.random(1) * 10000)
        return id
    }

    const numberId = generarId()
    const person = req.body
    person.id = numberId

    const nameV = person.name
    const personD = persons.filter(person => person.name == nameV)

    if (!person.name.trim() || !person.number.trim()) {
        console.log('Falta nombre o numero')
        return res.status(400).json({ 
            error: 'Falta nombre o numero' 
          })

    } else if (personD.length > 0 ) {
        console.log('Este nombre ya existe')
        return res.status(400).json({ 
            error: 'Este nombre ya existe' 
          })
    } else {
        persons = persons.concat(person)
        res.json(person)
        console.log('Persona registrada con exito')
    }

})


app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)

    res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})