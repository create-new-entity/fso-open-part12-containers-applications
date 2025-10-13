const { setAsync, getAsync } = require("../redis")

const TODO_COUNTER = 'TODO_COUNTER'

const incrementTodoCounter = async () => {
    const currentCount = await getAsync(TODO_COUNTER)
    setAsync(TODO_COUNTER, parseInt(currentCount, 10) + 1)
}

const getTodoCounterValue = async () => getAsync(TODO_COUNTER)

module.exports = {
    incrementTodoCounter,
    getTodoCounterValue
}