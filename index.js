const { request, response } = require('express')
const express = require('express')
const morgan = require('morgan')
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

const requestLogger = (request, response, next) => {
  console.log('Method: ', request.method);
  console.log('Path: ', request.path);
  console.log('Body: ', request,body);
  console.log('---');
  next()
}
morgan.token('body', (req, res) => JSON.stringify(req.body))


app.use(express.json())
// app.use(requestLogger)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (request, response) => {
  response.send(`<h1>Please visit other links.</h1>`)
})

app.get('/api/persons', (request, response) => {
    response.send(persons)
})

app.get('/api/persons/:id', (request, response) => {
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

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter((person) => person.id !== id)
  console.log("Persons: ", persons);
  response.status(204).end()
})

const generateId = () => {
  const maxId = persons.length > 0
  ? Math.max(...persons.map((p) => p.id))
  : 0
  const min = 0
  const randomId = Math.floor(Math.random() * (1000 - min) + min)
  return randomId
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  const existsDuplicateName = persons.find(person => person.name === body.name)
  // console.log(body);
  if(!body.name){
    return response.status(400).json({
      error: 'name missing'
    })
  }else if(!body.number){
    return response.status(400).json({
      error: 'number missing'
    })
  }else if(existsDuplicateName){
    return response.status(400).json({
      error: `${body.name} already has been added to the database.
      Please add a different name.`
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person)
  // console.log(persons)
  response.json(person)

})

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}
app.use(unknownEndpoint)

const PORT = 3001;

app.listen(PORT);
console.log(`Serving running on ${PORT}`);


