import * as React from "react";
import { Link } from "react-router-dom";
import { IProduct } from "./ProductsData";
import withLoader from "./WithLoader";

interface IProps {
  products: IProduct[];
  search: string;
}

const ProductsList: React.SFC<IProps> = props => {
  return (
    <ul className="product-list">
      {props.products.map(product => {
        if (
          !props.search ||
          (props.search && ~product.name.toLowerCase().indexOf(props.search.toLowerCase()))
        ) {
          return (
            <li key={product.id} className="product-list-item">
              <Link to={`/products/${product.id}`}>{product.name}</Link>
            </li>
          );
        } else {
          return null;
        }
      })}
    </ul>
  );
};

export default withLoader(ProductsList);
