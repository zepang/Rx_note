export interface IProduct {
  id: number;
  name: string;
  description: string;
  price: number;
}

export const products: IProduct[] = [
  {
    description: "A collection of navigational components that composedeclaratively with your app",
    id: 1,
    name: "React Router",
    price: 8
  },
  {
    description: "A library that helps manage state across yourapp",
    id: 2,
    name: "React Redux",
    price: 12
  },
  {
    description: "A library that helps you interact with aGraphQL backend",
    id: 3,
    name: "React Apollo",
    price: 12
  }
]