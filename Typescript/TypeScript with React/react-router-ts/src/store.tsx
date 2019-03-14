import { applyMiddleware, combineReducers, createStore, Store } from 'redux'
import thunk from "redux-thunk";
import { productsReducer } from "./ProductsReducer";
import { IProductsState } from "./ProductsTypes";
import { basketReducer } from './BasketReducer'
import { IBasketState } from './BasketTypes'

export interface IApplicationState {
  products: IProductsState,
  basket: IBasketState
}

const rootReducer = combineReducers<IApplicationState>({
  products: productsReducer,
  basket: basketReducer
})

export default function configureStore ():Store {
  const store = createStore(rootReducer, undefined, applyMiddleware(thunk))
  return store
}

