import { IProduct } from "./ProductsData"

export enum ProductsActionTypes {
  GETALL = 'PRODUCTS/GETALL',
  GETSINGLE = 'PRODUCTS/GETSINGLE',
  LOADING = 'PRODUCTS/LOADING'
}

export interface IProductsGetAllAction {
  type: ProductsActionTypes.GETALL;
  products: IProduct[];
}

export interface IProductsLoadingAction {
  type: ProductsActionTypes.LOADING;
}

export interface IProductsGetSingleAction {
  type: ProductsActionTypes.GETSINGLE;
  product: IProduct;
}


export type ProductsActions = IProductsGetAllAction | IProductsLoadingAction | IProductsGetSingleAction

export interface IProductsState {
  readonly products: IProduct[];
  readonly productsLoading: boolean;
  readonly currentProduct: IProduct | null;
}
