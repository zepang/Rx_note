import { Reducer } from "redux";
import { IProductsState, ProductsActions, ProductsActionTypes }
from "./ProductsTypes";

const initialProductState: IProductsState = {
  products: [],
  productsLoading: false
}

export const productsReducer: Reducer<IProductsState, ProductsActions> = (
  state = initialProductState,
  action
) => {
  switch (action.type) {
    case ProductsActionTypes.GETALL:
      return {
        ...state,
        productsLoading: false
      }
    case ProductsActionTypes.LOADING:
      return {
        ...state,
        productsLoading: true
      }
    default:
      return state
  }
}