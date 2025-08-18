import express from 'express'
import { connect } from 'mongoose'
import { MONGO, PORT } from './config'
import { Items } from './models/shop-item'
import { Order } from './models/order'// models
const cors = require('cors') // для разрешения кросс-доменных запросов
const bodyParser = require('body-parser') // для парсинга тела запроса

const app = express()

connect(MONGO).then(() => {
    console.log('Подключились к БД')
  })
  .catch((err) => {
    console.error('Ошибка подключения к БД:', err)
    process.exit(1)
  })

app.use(express.urlencoded({ extended: false })) // для обрабоники форм хорошо подходит
app.use(cors()) // вызывае как промежуточный обрабочик

app.use(bodyParser.urlencoded({ extended: false })) //  для парсинга тела запроса, сооденяет клиент и сервер
app.use(bodyParser.json()) // для парсинга тела запроса


app.get('/api/shop-items', async (req, res) => {
  try {
    const getItems = await Items.find().sort({ _id: 1 })
    if(!getItems) throw new Error('Не найдены товары')
    res.status(200).send(getItems)
  } catch(err) {
        console.log(err)
        res.status(500).send(err)
    }
})

app.get('/api/shop-items/:id', async (req, res) => {
  try {
    const getItem = await Items.findOne({ id: req.params.id })
    if(!getItem) throw new Error('Не найдены товары')
    res.status(200).send(getItem)
  } catch(err) {
        console.log(err)
        res.status(500).send(err)
    }
})

app.post('/api/shop-items', async (req, res) => {
  try {
    const result = await Order.insertMany(req.body)
    if(!result) throw new Error('Не найдены товары')
    res.status(200).send(result)
  } catch(err) {
        console.log(err)
        res.status(500).send(err)
    }
})

app.post('/api/shop-items/search', async (req, res) => {
  try {
    const result = await Items.find({ $text: {$search: req.body.search}})
    if(!result) throw new Error('Не найдены товары')
    res.status(200).send(result)
  } catch(err) {
        console.log(err)
        res.status(500).send(err)
    }
})

app.listen(PORT, () => {
  console.log('Сервер запущен на порту', PORT)
})