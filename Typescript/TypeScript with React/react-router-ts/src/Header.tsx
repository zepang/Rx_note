import * as React from 'react'
// NavLink 自动基于当前路由添加 class active
import { NavLink } from 'react-router-dom'
// import { Link } from 'react-router-dom'
import logo from './logo.svg'

const Header: React.SFC = () => {
  return (
    <header className="header">
      <img src={logo} alt="logo" className="header-logo"/>
      <h1 className="header-title">React Shop</h1>
      <nav>
        <NavLink className="header-link" to="/products">Products</NavLink>
        <NavLink className="header-link" to="/admin">Admin</NavLink>
      </nav>
    </header>
  )
}

export default Header
