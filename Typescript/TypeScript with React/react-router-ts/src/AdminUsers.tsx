import * as React from 'react'
import { NavLink, Route, RouteComponentProps } from 'react-router-dom'

export interface IUser {
  id: number;
  name: string;
  isAdmin: boolean;
}

export const adminUsersData: IUser[] = [
  { id: 1, name: "Fred", isAdmin: true },
  { id: 2, name: "Bob", isAdmin: false },
  { id: 3, name: "Jane", isAdmin: true }
]

const AdminUsers: React.SFC = () => {
  return (
    <div>
      <ul className="admin-sections">
        {adminUsersData.map(user => (
          <li key={user.id}>
            <NavLink
              to={`/admin/users/${user.id}`}
              activeClassName="admin-link-active"
            >
              {user.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AdminUsers
