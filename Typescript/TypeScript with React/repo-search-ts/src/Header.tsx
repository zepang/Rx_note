import React from 'react'
import axios from 'axios'
const AuthorizationToken = 'fa208ce234b57958288717a8a958a34e41336e4f'

interface IViewer {
  name: string;
  avatarUrl: string;
}

interface IQueryResult {
  data: {
    viewer: IViewer;
  }
}

export const Header: React.SFC = () => {
  const [viewer, setViewer]:[IViewer, () => void] = React.useState({
    name: '',
    avatarUrl: ''
  })

  React.useEffect(() => {
    axios.post<IQueryResult>(
      "https://api.github.com/graphql",
      {
        query: `query {
          viewer: {
            name
            avatarUrl
          }
        }`
      }, 
      {
        headers: {
        Authorization: `bearer ${AuthorizationToken}`
      }
    )
  }, [])

  return (
    
  )
}
