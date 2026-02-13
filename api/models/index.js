"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const getConfig = require("../../config/database.js");

const db = {};

// Função assíncrona para inicializar o Sequelize
async function initializeSequelize() {
  const config = await getConfig();
  return new Sequelize(config);
}

// Inicializar e exportar
const sequelizePromise = initializeSequelize();

sequelizePromise.then((sequelize) => {
  fs.readdirSync(__dirname)
    .filter((file) => {
      return (
        file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
      );
    })
    .forEach((file) => {
      const model = require(path.join(__dirname, file))(
        sequelize,
        Sequelize.DataTypes
      );
      db[model.name] = model;
    });

  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
});

db.ready = sequelizePromise.then(() => db);

module.exports = db;
