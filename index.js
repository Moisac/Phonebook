const express = require('express')
const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true);
const morgan = require('morgan')
const app = express()
const cors = require('cors')
require('dotenv').config()

const Person = require('./models/person')

app.use(express.static('build'))
app.use(express.json())
app.use(cors())


morgan.token('body', function (req, res) { 
  return JSON.stringify(req.body) 
});

app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));


  app.get('/', (req, res) => {
      res.send('<h1>Hello World!</h1>')
  })

  app.get('/api/phonebook', (req, res) => {
      Person.find({}).then(persons => {
        res.json(persons.map(person => person.toJSON()))
      })
  })

  const generateId = () => {
   return Math.floor(Math.random() * 6) + 1
  }

  app.post('/api/phonebook', (req, res, next) => {
    const body = req.body

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save().then(newPerson => {
      res.json(newPerson.toJSON())
    })
      .catch(error => {
        console.log(error.res.data)

        return next(error)
      })
  })

  app.get('/api/phonebook/:id', (req, res) => {

    Person.findById(req.params.id)
    .then(person => {
      if(person) {
        res.json(person.toJSON())
      } else {
          res.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })
  })

  app.put('/api/phonebook/:id', (req, res, next) => {
    const body = req.body

    const person = {
      name: body.name,
      number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, { new: true } )
      .then(updatedNumber => {
        res.json(updatedNumber.toJSON())
      })
      .catch(error => {
        console.log(error.res.data)

        return next(error)
      })
  })

  app.delete('/api/phonebook/:id', (req, res) => {
      Person.findByIdAndRemove(req.params.id)
      .then(person => {
        res.status(204).end()
      })
      .catch(error => next(error))
  })

  //error handler
  const errorHandler = (error, req, res, next) => {
    console.log(error.message)

    if(error.name === 'CaseError' && error.kind === 'ObjectId') {
      return res.status(400).send({ error: 'malformatted id' })
    } else if(error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message })
    }

    next(error)
  }

  app.use(errorHandler)

  const PORT = process.env.PORT || 3001

  app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
  })