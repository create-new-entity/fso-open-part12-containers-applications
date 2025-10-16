const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((acc, curr) => {
        return acc + curr.likes
    }, 0)
}

const favoriteBlog = (blogs) => {
    return blogs.reduce((acc, curr) => {
        if(curr.likes > acc.likes) {
            return curr
        }
        return acc
    })
}

const mostBlogs = (blogs) => {
    const counterMap = {}
    blogs.forEach((blog) => {
        counterMap[blog.author] = (counterMap[blog.author] || 0) + 1
    })
    const blogCounts = Object.keys(counterMap).map((author) => {
        return {
            author,
            blogs: counterMap[author]
        }
    })

    blogCounts.sort((a, b) => {
        return a.author.toLowerCase().localeCompare(b.author.toLowerCase())
    })

    const authorWithMostBlogs = blogCounts.reduce((acc, curr) => {
        if(curr.blogs > acc.blogs) {
            return curr
        }
        return acc
    })
    
    return authorWithMostBlogs
}

const mostLikes = (blogs) => {
    const counterMap = {}
    
    blogs.forEach((blog) => {
        counterMap[blog.author] = (counterMap[blog.author] || 0) + blog.likes
    })

    const likesCount = Object.keys(counterMap).map((author) => {
        return {
            author,
            likes: counterMap[author]
        }
    })

    likesCount.sort((a, b) => {
        return a.author.toLowerCase().localeCompare(b.author.toLowerCase())
    })

    const authorWithMostLikes = likesCount.reduce((acc, curr) => {
        if(curr.likes > acc.likes) {
            return curr
        }
        return acc
    })

    return authorWithMostLikes
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}