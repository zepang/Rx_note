import * as React from 'react'
import { RouteComponentProps, Prompt } from 'react-router-dom'
import { IProduct, products } from './ProductData'
import Product from './Product'

type Props = RouteComponentProps<{id: string}>

interface IState {
  product?: IProduct;
  added: boolean
}

class ProductPage extends React.Component<Props, IState> {
  public constructor(props: Props) {
    super(props)
    this.state = {
      added: false
    }
  }

  public componentDidMount () {
    if (this.props.match.params.id) {
      const id: number = parseInt(this.props.match.params.id, 10)
      const product = products.find(product => product.id === id)

      this.setState({ product })
    }
  }

  private handleAddClick = () =>  {
    this.setState({ added: true })
  }

  private navAwayMessage = () => "Are you sure you leave without buying this product?"

  public render () {
    const product = this.state.product
    return (
      <div className="page-container">
        <Prompt when={!this.state.added}
          message={this.navAwayMessage}
        />
      {
        product ? (
          <Product
            product={product}
            inBasket={this.state.added}
            onAddToBasket={this.handleAddClick}
          />
        ) : (
          <p>products not found!</p>
        )
      }
      </div>
    )
  }
}

export default ProductPage

