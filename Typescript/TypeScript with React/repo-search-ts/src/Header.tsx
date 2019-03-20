import React from "react"
import axios from "axios"
import gql from "graphql-tag"
import { Query } from "react-apollo"

const AuthorizationToken = "fa208ce234b57958288717a8a958a34e41336e4f"

interface IViewer {
  name: string
  avatarUrl: string
}

// interface IQueryResult {
//   data: {
//     viewer: IViewer
//   }
// }

interface IQueryResult {
  viewer: IViewer
}

const GET_VIEWER = gql`
  {
    viewer {
      name
      avatarUrl
      location
    }
  }
`

class GetViewerQuery extends Query<IQueryResult> {}

export const Header: React.SFC = () => {
  const [viewer, setViewer]: [
    IViewer,
    (viewer: IViewer) => void
  ] = React.useState({
    name: "",
    avatarUrl: ""
  })

  // React.useEffect(() => {
  //   axios
  //     .post<IQueryResult>(
  //       "https://api.github.com/graphql",
  //       {
  //         query: `query {
  //           viewer {
  //             id
  //             name
  //             avatarUrl
  //           }
  //         }`
  //       },
  //       {
  //         headers: {
  //           Authorization: `bearer ${AuthorizationToken}`
  //         }
  //       }
  //     )
  //     .then(res => {
  //       setViewer(res.data.data.viewer)
  //     })
  // }, [])

  return (
    <GetViewerQuery query={GET_VIEWER}>
      {({ data, loading, error }) => {
        if (error) {
          return <div className="viewer">{error.toString()}</div>
        }

        if (loading) {
          return <div className="viewer">Loading ...</div>
        }

        if (!data || !data.viewer) return null
        const viewer = data.viewer
        return (
          <div>
            <img src={viewer.avatarUrl} alt="" className="avatar" />
            <div className="viewer">{viewer.name}</div>
            <h1>Github Search</h1>
          </div>
        )
      }}
    </GetViewerQuery>
  )
}
