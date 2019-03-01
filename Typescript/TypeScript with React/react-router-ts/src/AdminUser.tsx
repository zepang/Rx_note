import * as React from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { IUser, adminUsersData } from './AdminUsers'

const AdminUser: React.SFC<RouteComponentProps<{id: string}>> = (props) => {
  let user: IUser
  if (props.match.params.id) {
    const id: number = parseInt(props.match.params.id, 10)
    user = adminUsersData.filter(u => u.id === id)[0]
  } else {
    return null;
  }
  return (
    <div>
      <div>
        <b>Id: </b>
        <span>{user.id.toString()}</span>
      </div>
      <div>
        <b>Is Admin: </b>
        <span>{user.isAdmin.toString()}</span>
      </div>
    </div>
  )
}

export default AdminUser