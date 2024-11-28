module.exports = (app) => {
  const todolist = require('../controllers/todolist.controller');

  const r = require('express').Router();

  r.get('/:user', todolist.findAll);
  r.get('/detail/:id', todolist.show);
  r.post('/', todolist.create);
  r.put('/:id', todolist.update);
  r.delete('/:id', todolist.delete);

  app.use('/todolist', r);
};
