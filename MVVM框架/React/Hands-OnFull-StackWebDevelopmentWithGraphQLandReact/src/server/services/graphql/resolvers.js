let posts = [
  {
    id: 2,
    text: 'Lorem ipsum',
    user: {
      avatar: '/uploads/avatar1.png',
      username: 'Test User'
    }
  },
  {
    id: 1,
    text: 'Lorem ipsum',
    user: {
      avatar: '/uploads/avatar2.png',
      username: 'Test User 2'
    }
  }
]
let users = [
  {
    id: 1,
    name: 'jack'
  }
]
const resolvers = {
  RootQuery: {
    posts(root, args, context) {
      return posts
    },
    users(root, args, context) {
      return users
    }
  }
}

export default resolvers
