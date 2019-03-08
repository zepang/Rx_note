import * as React from 'react'
import { Suspense } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { BrowserRouter as Router, Route, Switch, Redirect, RouteComponentProps } from 'react-router-dom'
import Header from './Header'
import ProductsPage from './ProductsPage'
import ProductPage from './ProductPage'
import LoginPage from './LoginPage'
import NotFoundPage from './NotFoundPage'
import ContactUsPage from './ContactUsPage';

const AdminPage = React.lazy(() => import('./AdminPage'))

interface IState {
  loggedIn: boolean;
}

// class Routes extends React.Component<RouteComponentProps, IState> {
//   constructor (props: RouteComponentProps) {
//     super(props)
//     this.state = {
//       loggedIn: true
//     }
//   }
//   public render () {
//     return (
//       <div>
//         <Header />
//         <TransitionGroup>
//           <CSSTransition 
//             key={this.props.location.key}
//             timeout={500}
//             classNames="animate">
//             <Switch>
//             <Redirect exact={true} from="/" to="/products"></Redirect>
//             <Route exact={true} path="/products" component={ProductsPage}></Route>
//             <Route path="/products/:id" component={ProductPage}></Route>
//             <Route path="/login" component={LoginPage}></Route>
//             <Route path="/admin">
//               {this.state.loggedIn ? <AdminPage /> : <Redirect to="/login" />}
//             </Route>
//             <Route component={NotFoundPage}></Route>
//           </Switch>
//           </CSSTransition>
//         </TransitionGroup>
//       </div>
//     )
//   }
// }

const Routes: React.SFC<RouteComponentProps> = (props) => {
  const [loggedIn] = React.useState(true)
  return (
    <div>
      <Header />
      {/* <TransitionGroup>
        <CSSTransition 
          key={props.location.key}
          timeout={500}
          classNames="animate"> */}
          <Switch>
          <Redirect exact={true} from="/" to="/products"></Redirect>
          <Route exact={true} path="/products" component={ProductsPage}></Route>
          <Route path="/products/:id" component={ProductPage}></Route>
          <Route path="/login" component={LoginPage}></Route>
          <Route path="/contactus" component={ContactUsPage}></Route>
          <Route path="/admin">
            {loggedIn ? 
              <Suspense fallback={<div className="page-container">Loading...</div>}>
                <AdminPage /> 
              </Suspense> : <Redirect to="/login" />}
          </Route>
          <Route component={NotFoundPage}></Route>
        </Switch>
        {/* </CSSTransition>
      </TransitionGroup> */}
    </div>
  )
}

const RoutesWrap: React.SFC = () => {
  return(
    <Router>
      <Route component={Routes} />
    </Router>
  )
}

export default RoutesWrap
