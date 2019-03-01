import * as React from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import Header from './Header'
import AdminPage from './AdminPage'
import ProductsPage from './ProductsPage'
import ProductPage from './ProductPage'
import LoginPage from './LoginPage'
import NotFoundPage from './NotFoundPage'

const Routes: React.SFC = () => {
  const [loggedIn, setLoggedIn] = React.useState(true)
  return (
    <Router>
      <div>
        <Header />
        <Switch>
          <Redirect exact={true} from="/" to="/products"></Redirect>
          <Route exact={true} path="/products" component={ProductsPage}></Route>
          <Route path="/products/:id" component={ProductPage}></Route>
          <Route path="/login" component={LoginPage}></Route>
          <Route path="/admin">
            {loggedIn ? <AdminPage /> : <Redirect to="/login" />}
          </Route>
          <Route component={NotFoundPage}></Route>
        </Switch>
      </div>
    </Router>
  )
}

export default Routes
