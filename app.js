"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = require("mongoose");
const config_1 = require("./config");
const shop_item_1 = require("./models/shop-item");
const order_1 = require("./models/order"); // models
const cors = require('cors'); // для разрешения кросс-доменных запросов
const bodyParser = require('body-parser'); // для парсинга тела запроса
const app = (0, express_1.default)();
(0, mongoose_1.connect)(config_1.MONGO).then(() => {
    console.log('Подключились к БД');
})
    .catch((err) => {
    console.error('Ошибка подключения к БД:', err);
    process.exit(1);
});
app.use(express_1.default.urlencoded({ extended: false })); // для обрабоники форм хорошо подходит
app.use(cors()); // вызывае как промежуточный обрабочик
app.use(bodyParser.urlencoded({ extended: false })); //  для парсинга тела запроса, сооденяет клиент и сервер
app.use(bodyParser.json()); // для парсинга тела запроса
app.get('/api/shop-items', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getItems = yield shop_item_1.Items.find().sort({ _id: 1 });
        if (!getItems)
            throw new Error('Не найдены товары');
        res.status(200).send(getItems);
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}));
app.get('/api/shop-items/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getItem = yield shop_item_1.Items.findOne({ id: req.params.id });
        if (!getItem)
            throw new Error('Не найдены товары');
        res.status(200).send(getItem);
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}));
app.post('/api/shop-items', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield order_1.Order.insertMany(req.body);
        if (!result)
            throw new Error('Не найдены товары');
        res.status(200).send(result);
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}));
app.post('/api/shop-items/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield shop_item_1.Items.find({ $text: { $search: req.body.search } });
        if (!result)
            throw new Error('Не найдены товары');
        res.status(200).send(result);
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}));
app.listen(config_1.PORT, () => {
    console.log('Сервер запущен на порту', config_1.PORT);
});
