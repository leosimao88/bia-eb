const db = require("../models");

module.exports = () => {
  const controller = {};

  controller.create = async (req, res) => {
    try {
      await db.ready;
      const { Tarefas } = db;
      let tarefa = {
        titulo: req.body.titulo,
        dia_atividade: req.body.dia,
        importante: req.body.importante,
      };

      const data = await Tarefas.create(tarefa);
      res.send(data);
    } catch (err) {
      res.status(500).send({
        message: err.message || "Deu ruim.",
      });
    }
  };

  controller.find = async (req, res) => {
    try {
      await db.ready;
      const { Tarefas } = db;
      let uuid = req.params.uuid;
      const data = await Tarefas.findByPk(uuid);
      res.send(data);
    } catch (err) {
      res.status(500).send({
        message: err.message || "Deu ruim.",
      });
    }
  };

  controller.delete = async (req, res) => {
    try {
      await db.ready;
      const { Tarefas } = db;
      let { uuid } = req.params;

      await Tarefas.destroy({
        where: {
          uuid: uuid,
        },
      });
      res.send();
    } catch (err) {
      res.status(500).send({
        message: err.message || "Deu ruim.",
      });
    }
  };

  controller.update_priority = async (req, res) => {
    try {
      await db.ready;
      const { Tarefas } = db;
      let { uuid } = req.params;

      await Tarefas.update(req.body, {
        where: {
          uuid: uuid,
        },
      });
      const data = await Tarefas.findByPk(uuid);
      res.send(data);
    } catch (err) {
      res.status(500).send({
        message: err.message || "Deu ruim.",
      });
    }
  };

  controller.findAll = async (req, res) => {
    try {
      await db.ready;
      const { Tarefas } = db;
      const data = await Tarefas.findAll();
      res.send(data);
    } catch (err) {
      res.status(500).send({
        message: err.message || "Deu ruim.",
      });
    }
  };
  return controller;
};
