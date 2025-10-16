
const generateRandomNUsers = (n, startFrom) => {
    const randomUsers = []
    for(let i=startFrom; i< startFrom + n; i++) {
        randomUsers.push({
            username: `test_user${i}`,
            password: `test_user${i}_password`,
            name: `Test User ${i}`
        })
    }
    return randomUsers
}

const initialData = {
    generateRandomNUsers
}

module.exports = initialData