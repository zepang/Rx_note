import { gql } from 'apollo-server-express'
const typeDefs = gql`
  type User {
    id: Int
    name: String
  }
  type Post {
    id: Int
    text: String
  }
  type RootQuery {
    users: [User]
    posts: [Post]
  }
  schema {
    query: RootQuery
  }
`

export default typeDefs
