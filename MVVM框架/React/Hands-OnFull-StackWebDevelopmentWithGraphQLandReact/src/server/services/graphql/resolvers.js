// import logger from '../../helpers/logger'

export default function resolver () {
  const { db } = this
  const { Post } = db.models
  const resolvers = {
    RootQuery: {
      posts(root, args, context) {
        return Post.findAll({ order: [['createdAt', 'DESC']] })
      }
    },
    RootMutation: {
      // addPost(root, { post, user }, context) {
      //   const postObject = {
      //     ...post,
      //     user,
      //     id: posts.length + 1
      //   }
      //   posts.push(postObject)
      //   logger.log({ level: 'info', message: 'Post was created' })
      //   return postObject
      // }
    }
  }
  return resolvers
}
