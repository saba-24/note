const morgan = require('morgan');
const express = require('express');
const cors = require('cors')
const port = process.env.PORT || 3001

const app = express()
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('dist'))
let notes = [
    {
        id: "1",
        content: "HTML is easy",
        important: true
    },
    {
        id: "2",
        content: "Browser can execute only JavaScript",
        important: false
    },
    {
        id: "3",
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
]

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello  World!</h1>')
})

app.get('/api/notes/:id', (req, res) => {
    const id = req.params.id
    const note = notes.find((note) => note.id === id)
    if(note) {
        res.json(note)
    } else {
        res.status(404).end('no such note')
    }
})

app.get('/api/notes', (req, res) => {
    res.json(notes)
})

app.post('/api/notes', (req, res) => {
    const note = req.body
    const maxID = notes.length > 0
        ?Math.max(...notes.map(note => Number(note.id)))
        :0
    note.id = String(maxID + 1)
    notes = notes.concat(note)
    if(!req.body.content){
        return res.status(400).json({
            error: 'No content',
        })
    }
    res.json(note)
})

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id
    notes = notes.filter((note) => note.id !== id)
    res.status(204).end('note deleted')
})

app.get('/api/phonebook/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(person => person.id === id)
    if(person) {
        res.json(person)
    }
    else{
        res.status(404).end('no such person')
    }
})

app.delete('/api/phonebook/:id', (req, res) => {
    const id = req.params.id
    persons = persons.filter((person) => person.id !== id)
    console.log(persons)
    res.status(204).end('deleted successfully')
})

app.post('/api/phonebook', (req, res) => {
    const {number, name} = req.body

    if(!number || !name) {
        res.status(400).end('missing field')
    }

    if(persons.filter(person => person.name === name).length > 0) {
        res.status(409).end(`${name} already registered`)
    }

    else {
    persons = persons.concat({
        'number': number,
        'name': name,
        'id': Math.floor(Math.random() * 10000).toString(),
    })
    res.json(persons)
        }
})

app.get('/api/phonebook', (req, res) => {
    res.json(persons)
})

const p = persons.length === 1 ? 'person' : 'people'
const time = new Date()

app.get('/info',
    (req, res) => {
        res.send( ' Phonebook has info for ' + persons.length +
            p + '<br>' + time
        )
    })

app.listen(port, '192.168.1.31')