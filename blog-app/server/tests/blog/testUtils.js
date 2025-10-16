
const areIdsUniq = (blogs) => {
    const ids = blogs.map(blog => blog.id)
    return ids.length === new Set(ids).size
}

const testUtils = {
    areIdsUniq
}

module.exports = testUtils