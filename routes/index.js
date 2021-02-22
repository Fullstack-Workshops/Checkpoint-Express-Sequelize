const express = require('express');
const router = express.Router();
const todos = require('../models/express-models/todos');
module.exports = router;

// write your routes here. Feel free to split into multiple files if you like.
router.get('/', (req, res, next) => {
  try {
    let users = todos.listPeople();
    res.json(users);
  } catch (error) {
    next(error);
  }
})

router.get('/:name/tasks', (req, res, next) => {
  try {
    let user = todos.list(req.params.name);
    if (!user) {
      let err = Error('User does not exist');
      err.status = 404;
      throw err;
    }
    if (req.query.status === 'complete') {
      let completed = user.filter((todo) => todo.complete === true)
      res.json(completed);
    } else if (req.query.status === 'active') {
      let active = user.filter((todo) => todo.complete === false);
      res.json(active);
    } else {
      res.json(user);
    }
  } catch (error) {
    next(error);
  }
})

router.post('/:name/tasks', (req, res, next) => {
  try {
    let added = todos.add(req.params.name, req.body);
    if (!req.body.content) {
      let err = Error('todo to add does not exist');
      err.status = 400;
      throw err;
    }
    res.status(201).json(added);
  } catch (error) {
    next(error);
  }
})

router.put('/:name/tasks/:idx', (req, res, next) => {
  try {
    todos.complete(req.params.name, req.params.idx);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
})

router.delete('/:name/tasks/:idx', (req, res, next) => {
  try {
    todos.remove(req.params.name, req.params.idx);
    res.sendStatus(204)
  } catch (error) {
    next(error);
  }
})
