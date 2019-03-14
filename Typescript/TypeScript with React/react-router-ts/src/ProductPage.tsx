import * as React from "react"
import { RouteComponentProps, Prompt } from "react-router-dom"
import { IProduct } from "./ProductData"
import Product from "./Product"
import { connect } from "react-redux"
import { addToBasket } from "./BasketActions"
import { getProduct } from "./ProductsActions"
import { IApplicationState } from "./Store"

interface IProps extends RouteComponentProps<{ id: string }> {
  addToBasket: typeof addToBasket
  getProduct: typeof getProduct
  loading: boolean
  product?: IProduct
  added: boolean
}

class ProductPage extends React.Component<IProps, {}> {
  public constructor(props: IProps) {
    super(props)
  }

  public componentDidMount() {
    if (this.props.match.params.id) {
      const id: number = parseInt(this.props.match.params.id, 10)
      this.props.getProduct(id)
    }
  }

  private handleAddClick = () => {
    if (this.props.product) {
      this.props.addToBasket(this.props.product)
    }
  }

  private navAwayMessage = () =>
    "Are you sure you leave without buying this product?"

  public render() {
    const product = this.props.product
    return (
      <div className="page-container">
        <Prompt when={!this.props.added} message={this.navAwayMessage} />
        {product || this.props.loading ? (
          <Product
            loading={this.props.loading}
            product={product}
            inBasket={this.props.added}
            onAddToBasket={this.handleAddClick}
          />
        ) : (
          <p>products not found!</p>
        )}
      </div>
    )
  }
}

const mapStateTopProps = (store: IApplicationState) => {
  return {
    added: store.basket.products.some(p =>
      store.products.currentProduct ? p.id ===
      store.products.currentProduct.id : false),
    basketProducts: store.basket.products,
    loading: store.products.productsLoading,
    product: store.products.currentProduct || undefined
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    addToBasket: (product: IProduct) => dispatch(addToBasket(product)),
    getProduct: (id: number) => dispatch(getProduct(id))
  }
}

export default connect(
  mapStateTopProps,
  mapDispatchToProps
)(ProductPage)
