const sequelize = require('./src/db/sequelize');

sequelize.authenticate()
    .then (() => console.log("kapcsolat oké"))
    .catch((error) => console.error("kapcsolat hiba", error.message))
    .finally(() => sequelize.close());  