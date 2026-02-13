"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const getConfig = require("../../config/database.js");

let db = {};
let initialized = false;

async function initialize() {
  if (initialized) return db;
  
  const config = await getConfig();
  const sequelize = new Sequelize(config);

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
  initialized = true;
  
  return db;
}

module.exports = new Proxy({}, {
  get: (target, prop) => {
    if (prop === 'initialize') return initialize;
    if (!initialized) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
    return db[prop];
  }
});
