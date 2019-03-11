import * as React from 'react'
import { IProduct, products } from './ProductsData'
import { Link, RouteComponentProps } from 'react-router-dom'
import { IApplicationState } from "./Store";
import { getProducts } from "./ProductsActions";
import { connect } from "react-redux";
import 'url-search-params-polyfill'

// interface IState {
//   products: IProduct[];
//   search: string;
// }

interface IProps extends RouteComponentProps {
  getProducts: typeof getProducts;
  loading: boolean;
  products: IProduct[];
}

class ProductsPage extends React.Component<IProps> {
  public constructor(props: IProps) {
    super(props)
  }

  // public static getDerivedStateFromProps (
  //   props: RouteComponentProps, 
  //   state: IState
  //   ) {
  //     const searchParams = new URLSearchParams(props.location.search)
  //     const search = searchParams.get('search') || ''
  //     return {
  //       products: state.products,
  //       search
  //     }
  //   }

  public componentDidMount () {
    this.props.getProducts()
  }

  public render () {
    const searchParams = new URLSearchParams(this.props.location.search)
    const search = searchParams.get('search') || ''
    return (
      <div className="page-container">
        <p>Welcome to React Shop where you can get all your toolsfor ReactJS!</p>
        <ul className="product-list">
          {
            this.props.products.map(product => {
              if (
                !search ||
                (search && 
                  ~product.name.toLowerCase().indexOf(search.toLowerCase()))
              ) {
                return (
                  <li key={product.id} className="product-list-item">
                    <Link to={`/products/${product.id}`}>{product.name}</Link>
                  </li>
                )
              } else {
                return null
              }
            })
          }
        </ul>
      </div>
    )
  }
}

const mapStateToProps = (store: IApplicationState) => {
  return {
    products: store.products.products,
    loading: store.products.productsLoading
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    getProducts: () => dispatch(getProducts())
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductsPage)

