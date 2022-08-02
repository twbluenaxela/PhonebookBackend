require('dotenv').config()
const { request, response } = require('express')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const person = require('./models/person')
const app = express()

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(express.json())
app.use(cors())
app.use(express.static('build'))
app.use(requestLogger)
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

// app.get("/", (request, response) => {
//   response.send(`<h1>Please visit other links.</h1>`);
// });

app.get('/api/persons', (request, response) => {
  Person.find({}).then((people) => {
    response.json(people)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})

app.get('/info', (request, response) => {
  Person.find({}).then((people) => {
    const numOfPersons = people.length
    const dateTime = new Date()
    const infoElement = `<div>
      <p>Phonebook has info for ${numOfPersons} people</p>
      <p>${dateTime}</p>
    </div>`
    response.send(infoElement)
  })
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end()
    })
    .catch((error) => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  // const body = request.body;
  // const person = {
  //   name: body.name,
  //   number: body.number,
  // };
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true }
  )
    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  if (!body.name) {
    return response.status(400).json({
      error: 'name missing',
    })
  } else if (!body.number) {
    return response.status(400).json({
      error: 'number missing',
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  Person.find({ name: body.name }).then((foundPeople) => {
    console.log('Found person', foundPeople)
    console.log('Found people length: ', foundPeople.length)
    if (foundPeople.length > 0) {
      return response
        .status(400)
        .send({ error: 'User already exists. Attempt to add failed.' })
    }
    person
      .save()
      .then((savedPerson) => {
        response.json(savedPerson)
      })
      .catch((error) => next(error))
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.log(error.message)
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT)
console.log(`Serving running on ${PORT}`)
