const express = require('express');
const config = require('config');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
app.use(express.json({ extended: true })); // чтобы express мог парсить request.body 

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/link', require('./routes/link.routes'));
app.use('/t', require('./routes/redirect.routes'));


// app.use === (/,req) = если идет запрос на / то делаем что-то

if (procces.env.NODE_ENV === 'production') {
    app.use('/', express.static(path.join(__dirname, 'client', 'build')));
    app.get('*', (req, res) => {
        res.sendfile(path.resolve(__dirname, 'client', 'build', 'index.html')); // запускаем и front и back одновременно
    }); // * = любой get запрос

}

const PORT = config.get('port') || 3002;

const start = async () => {
    try {
        await mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`));
    } catch (e) {
        console.log('Server error', e.message);
        process.exit(1);
    }
};
start();