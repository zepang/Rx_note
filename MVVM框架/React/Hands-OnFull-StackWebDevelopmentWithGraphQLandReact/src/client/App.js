import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import './app.css'

const posts = [
  {
    id: 1,
    text: 'Lorem ipsum',
    user: { avatar: '/uploads/avatar1.png', username: 'Test User 1' }
  },
  {
    id: 2,
    text: 'Lorem ipsum',
    user: { avatar: '/uploads/avatar2.png', username: 'Test User 2' }
  }
]

export default class App extends Component {
  state = {
    posts: posts,
    postContent: ''
  }
  handlePostContentChange = event => {
    this.setState({
      postContent: event.currentTarget.value
    })
  }
  handleSubmit = event => {
    event.preventDefault()
    const newPost = {
      id: this.state.posts.length + 1,
      text: this.state.postContent,
      user: {
        avatar: '/uploads/avatar1.png',
        username: 'Fake User'
      }
    }
    this.setState((prevState) => ({
      posts: [newPost, ...prevState.posts],
      postContent: ''
    }))
  }
  render() {
    const { posts, postContent } = this.state
    return (
      <div className="container">
        <Helmet>
          <title>Graphbook - Feed</title>
          <meta name="description" content="Newfeed of all your friends on Graphbook"/>
        </Helmet>
        <div className="postForm">
          <form onSubmit={this.handleSubmit}>
            <textarea
              cols="30"
              rows="10"
              value={postContent}
              onChange={this.handlePostContentChange}
            />
            <input type="submit" value="Submit" />
          </form>
        </div>
        <div className="feed">
          {posts.map((post, i) => (
            <div className="post" key={i}>
              <div className="header">
                <img src={post.user.avatar} alt="" />
                <h3>{post.user.username}</h3>
              </div>
              <p className="content">{post.text}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }
}
