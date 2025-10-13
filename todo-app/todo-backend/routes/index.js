const redis = require('../redis')
const express = require('express');
const router = express.Router();

const configs = require('../util/config');
const { getTodoCounterValue } = require('../util/todoCounter');


router.get('/statistics', async (_, res) => {
  const totalCount = await getTodoCounterValue();
  res.send({
    added_todos: totalCount
  })
})

let visits = 0

/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits
  });
});

module.exports = router;
