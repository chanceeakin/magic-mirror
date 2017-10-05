import React from 'react'
import PropTypes from 'prop-types'
import {Switch, Route} from 'react-router-dom'
import asyncComponent from './../components/Async-Component'

const Home = asyncComponent(() => import('./../containers/Home'))
const Signup = asyncComponent(() => import('./../containers/Signup'))
const Async404 = asyncComponent(() => import('./../containers/404Page'))

const Routes = ({match, childProps}) => (
  <Switch>
    <Route
      exact
      path={'/'}
      component={Home}
    />
    <Route
      path={'/signup'}
      component={Signup}
    />
    <Route
      path={'*'}
      component={Async404}
    />
  </Switch>
)

Routes.propTypes = {
  childProps: PropTypes.object,
  match: PropTypes.object
}

export default Routes
