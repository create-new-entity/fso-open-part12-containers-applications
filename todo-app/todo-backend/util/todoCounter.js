const { setAsync, getAsync } = require("../redis")

const TODO_COUNTER = 'TODO_COUNTER'

const incrementTodoCounter = async () => {
    let currentCount = await getAsync(TODO_COUNTER)
    currentCount = (!currentCount || isNaN(currentCount) || currentCount.toLowerCase() === 'nan') ? 0 : currentCount
    setAsync(TODO_COUNTER, parseInt(currentCount, 10) + 1)
}

const getTodoCounterValue = async () => getAsync(TODO_COUNTER)

module.exports = {
    incrementTodoCounter,
    getTodoCounterValue
}