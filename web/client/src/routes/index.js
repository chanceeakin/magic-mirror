import React from 'react'
import PropTypes from 'prop-types'
import {
  Switch,
  Redirect,
  Route
} from 'react-router-dom'
import asyncComponent from './../components/Async-Component'

const Splash = asyncComponent(() => import('./../containers/Splash'))
const Signup = asyncComponent(() => import('./../containers/Signup'))
const Home = asyncComponent(() => import('./../containers/Home'))
const Async404 = asyncComponent(() => import('./../containers/404Page'))

const AuthedHome = ({ component: Component, isUserAuthed, ...rest }) => (
  <Route {...rest} render={props => (
    isUserAuthed ? (
      <Component {...props} />
    ) : (
      <Redirect to={{
        pathname: '/'
      }} />
    )
  )} />
)

const Routes = ({match, childProps, isUserAuthed}) => (
  <Switch>
    <Route
      exact
      path={'/'}
      component={Splash}
    />
    <Route
      path={'/signup'}
      component={Signup}
    />
    {/* TODO: THIS NEEDS TO BE AN AUTHED ROUTE */}
    <AuthedHome
      path={'/home'}
      component={Home}
      isUserAuthed={isUserAuthed}
    />
    <Route
      path={'*'}
      component={Async404}
    />
  </Switch>
)

AuthedHome.propTypes = {
  component: PropTypes.func,
  isUserAuthed: PropTypes.bool.isRequired
}

Routes.propTypes = {
  childProps: PropTypes.object,
  match: PropTypes.object,
  isUserAuthed: PropTypes.bool.isRequired
}

export default Routes
