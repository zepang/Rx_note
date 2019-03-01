import * as React from 'react'
// NavLink 自动基于当前路由添加 class active
import { NavLink, RouteComponentProps, withRouter } from 'react-router-dom'
// import { Link } from 'react-router-dom'
import logo from './logo.svg'
import 'url-search-params-polyfill'

const Header: React.SFC<RouteComponentProps> = (props) => {
  const [search, setSearch] = React.useState('')
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value)
  }
  const handleSearchKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      props.history.push(`/products?search=${search}`)
    }
  }
  React.useEffect(() =>{
    const searchParams = new URLSearchParams(props.location.search)
    setSearch(searchParams.get('search') || '')
  }, [])
  return (
    <header className="header">
      <div className="search-container">
        <input
          type="search"
          placeholder="search"
          value={search}
          onChange={handleSearchChange}
          onKeyDown={handleSearchKeydown}
        />
      </div>
      <img src={logo} alt="logo" className="header-logo"/>
      <h1 className="header-title">React Shop</h1>
      <nav>
        <NavLink className="header-link" to="/products">Products</NavLink>
        <NavLink className="header-link" to="/admin">Admin</NavLink>
      </nav>
    </header>
  )
}

export default withRouter(Header)
