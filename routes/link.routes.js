const { Router } = require('express');
const Link = require('../models/Link');
const auth = require('../middleware/auth.middleware');
const config = require('config');
const shortid = require('shortid');
const router = Router();

// генерируем новую ссылку
router.post('/generate', auth, async (req, res) => {
    try {
        const baseUrl = config.get('baseUrl'); // получаем url из конфига по которому будет делать запрос post
        const { from } = req.body;
        // генерируем уникальный код для ссылки
        const code = shortid.generate();

        // если ссылка существует уже существует
        const existing = await Link.findOne({ from });
        if (existing) {
            return res.json({ link: existing });
        }

        const to = baseUrl + '/t/' + code;
        const link = new Link({
            code, to, from, owner: req.user.userId
        });
        await link.save();
        res.status(201).json({ link }); // 201 это статус - created
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
    }
});

// получение всех ссылок конкретного пользователя
router.get('/', auth, async (req, res) => {
    try {
        const links = await Link.find({ owner: req.user.userId }); // ищем все ссылки которые относятся к текущему пользователю
        res.json(links);
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
    }
});

// получение ссылки по id
router.get('/:id', auth, async (req, res) => {
    try {
        const link = await Link.findById(req.params.id);
        res.json(link);
    } catch (e) {
        res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' });
    }
});

module.exports = router;