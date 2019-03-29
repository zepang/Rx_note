import { gql } from 'apollo-server-express'
const typeDefs = gql`
  type User {
    avatar: String
    username: String
  }

  type Post {
    id: Int
    text: String
    user: User
  }

  input PostInput {
    text: String!
  }

  input UserInput {
    username: String!
    avatar: String!
  }

  type RootQuery {
    users: [User]
    posts: [Post]
  }

  type RootMutation {
    addPost (
      post: PostInput!
      user: UserInput!
    ): Post
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`

export default typeDefs
