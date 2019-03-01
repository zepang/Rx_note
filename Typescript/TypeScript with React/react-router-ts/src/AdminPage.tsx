import * as React from 'react'
import { NavLink, Route, RouteComponentProps } from 'react-router-dom'
import AdminUsers from './AdminUsers'
import AdminProducts from './AdminProducts'
import AdminUser from './AdminUser'

const AdminPage: React.SFC = (props) => {
  const [loggedIn, setLoggedIn] = React.useState(true)
  return (
    <div className="page-container">
      <h1>Admin Panel</h1>
      <ul className="admin-sections">
        <li className="users">
          <NavLink to={`/admin/users`} activeClassName="admin-link-active">
            Users
          </NavLink>
        </li>
        <li className="products">
        <NavLink to={`/admin/products`} activeClassName="admin-link-active">
          Products
        </NavLink>
        </li>
      </ul>
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/admin/products" component={AdminProducts} />
      <Route path="/admin/users/:id" component={AdminUser} />
    </div>
  )
}

export default AdminPage