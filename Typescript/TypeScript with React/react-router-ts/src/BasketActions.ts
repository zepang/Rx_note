import { BasketActionTypes, IBasketAdd } from './BasketTypes'
import { IProduct } from './ProductsData'

export const addToBasket = (product: IProduct): IBasketAdd => {
  return {
    type: BasketActionTypes.ADD,
    product
  }
}

