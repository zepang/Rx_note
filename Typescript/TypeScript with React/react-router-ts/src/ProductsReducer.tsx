import { Reducer } from "redux";
import { IProductsState, ProductsActions, ProductsActionTypes }
from "./ProductsTypes";

const initialProductState: IProductsState = {
  products: [],
  productsLoading: false,
  currentProduct: null
}

export const productsReducer: Reducer<IProductsState, ProductsActions> = (
  state = initialProductState,
  action
) => {
  switch (action.type) {
    case ProductsActionTypes.GETALL:
      return {
        ...state,
        products: action.products,
        productsLoading: false
      }
    case ProductsActionTypes.LOADING:
      return {
        ...state,
        productsLoading: true
      }
    case ProductsActionTypes.GETSINGLE:
      return {
        ...state,
        currentProduct: action.product,
        productsLoading: false
      }
    default:
      return state
  }
}