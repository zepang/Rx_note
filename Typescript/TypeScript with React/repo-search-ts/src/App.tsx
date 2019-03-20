import React, { Component } from "react"
import "./App.css"
import { Header } from "./Header"
import ApolloClient from "apollo-boost"
import { ApolloProvider } from "react-apollo"

const AuthorizationToken = "fa208ce234b57958288717a8a958a34e41336e4f"

const client = new ApolloClient({
  uri: "https://api.github.com/graphql",
  headers: {
    Authorization: `Bearer ${AuthorizationToken}`
  }
})

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <header className="App-header">
            <Header />
          </header>
        </div>
      </ApolloProvider>
    )
  }
}

export default App
