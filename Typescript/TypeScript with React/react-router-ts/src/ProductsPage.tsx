import * as React from 'react'
import { IProduct, products } from './ProductData'

interface IState {
  products: IProduct[]
}

class ProductsPage extends React.Component<{}, IState> {
  public constructor(props: {}) {
    super(props)
    this.state = {
      products: []
    }
  }
  public componentDidMount () {
    this.setState({ products })
  }

  public render () {
    return (
      <div className="page-container">
        <p>Welcome to React Shop where you can get all your toolsfor ReactJS!</p>
        <ul className="product-list">
          {
            this.state.products.map(product => (
              <li key={product.id} className="product-list-item">
                {product.name}
              </li>
            ))
          }
        </ul>
      </div>
    )
  }
}

export default ProductsPage

