import React, { Component } from 'react'

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
    posts: post
  }
  render() {
    const { posts } = this.state
    return (
      <div className="container">
        <div className="feed">
          {posts.map((post, i) => (
            <div className="post" key={i}>
              <div className="header">
                <img src={post.user.avtar} alt="" />
                <h3>{post.user.name}</h3>
              </div>
              <p className="content">{post.text}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }
}
