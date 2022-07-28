const { request, response } = require('express')
const express = require('express')
const app = express()

let persons = [
    {
      "id": 1,
      "name": "Arto Hellas",
      "number": "040-123456"
    },
    {
      "id": 2,
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
    },
    {
      "id": 3,
      "name": "Dan Abramov",
      "number": "12-43-234345"
    },
    {
      "id": 4,
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
    }
]
app.use(express.json())

app.get('/api/persons', (request, response) => {
    response.send(persons)
})

app.get('/api/person/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  }else{
    response.status(404).end()
  }
})

app.get('/info', (request, response) => {
  const numOfPersons = persons.length
  const dateTime = new Date()
  const infoElement = 
  `<div>
    <p>Phonebook has info for ${numOfPersons} people</p>
    <p>${dateTime}</p>
  </div>`
  response.send(infoElement)
})

const PORT = 3001;

app.listen(PORT);
console.log(`Serving running on ${PORT}`);


