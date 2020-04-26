const express = require('express')
const morgan = require('morgan')
const app = express()


app.use(express.json())

morgan.token('body', function (req, res) { 
  return JSON.stringify(req.body) 
});

app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]'));

let phonebook = [
    {
      id: 1,
      name: "Mike",
      number: "2142121512",
    },
    {
      id: 2,
      name: "Jack",
      number: "12415251",
    },
    {
      id: 3,
      name: "Bela",
      number: "12315215",
    }
  ]

  app.get('/', (req, res) => {
      res.send('<h1>Hello World!</h1>')
  })

  app.get('/api/phonebook', (req, res) => {
      res.json(phonebook)
  })

  app.get('/info', (req, res) => {
      res.send(`Phonebook has info for ${phonebook.length} people <br /> ${new Date()}`)
  })

  const generateId = () => {
   return Math.floor(Math.random() * 6) + 1
  }

  app.post('/api/phonebook', (req, res) => {
    const body = req.body
    const name = req.body.name
    const nameExist = phonebook.find(person => person.name === name)

    if(!body.name || !body.number) {
      return res.status(400).json({
        error: 'Name or number can\'t be empty'
      })
    }

    if(nameExist) {
      return res.status(400).json({
        error: `${name} already exist`
      })


    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    phonebook = phonebook.concat(person)

    res.json(person)
  })

  app.get('/api/phonebook/:id', (req, res) => {
      const id = Number(req.params.id)
      const person = phonebook.find(person => person.id === id)

      if(person) {
          res.json(person)
      } else {
          res.status(404).end()
      }
  })

  app.delete('/api/phonebook/:id', (req, res) => {
      const id = Number(req.params.id)
      phonebook = phonebook.filter(person => person.id !== id)

      res.status(204).end()
  })


  

  const PORT = 3001

  app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
  })