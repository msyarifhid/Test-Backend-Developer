const app = require('./app');
const sequelize = require('./config/database');

const APP_PORT = process.env.APP_PORT || 3000;
const APP_URL = process.env.APP_URL || `http://localhost:${APP_PORT}`;

sequelize.sync().then(() => {
    app.listen(APP_PORT, () => {
        console.log(`API running on ${APP_URL}`);
    });
}).catch(err => {
    console.log('Unable to sync database:', err);
});