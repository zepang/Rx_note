import * as React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Header from './Header'
import AdminPage from './AdminPage'
import ProductsPage from './ProductsPage'
import ProductPage from './ProductPage'

const Routes: React.SFC = () => {
  return (
    <Router>
      <div>
        <Header />
        <Route exact={true} path="/products" component={ProductsPage}></Route>
        <Route path="/products/:id" component={ProductPage}></Route>
        <Route path="/admin" component={AdminPage}></Route>
      </div>
    </Router>
  )
}

export default Routes
