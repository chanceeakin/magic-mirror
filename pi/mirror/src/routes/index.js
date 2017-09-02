import React from 'react'
import PropTypes from 'prop-types'
import {Switch, Route} from 'react-router-dom'
import asyncComponent from './../components/Async-Component'

const App = asyncComponent(() => import('./../containers/App'))

const Routes = ({match, childProps}) => (
  <Switch>
    <Route
      path={'/'}
      component={App}
    />
  </Switch>
)

Routes.propTypes = {
  childProps: PropTypes.object,
  match: PropTypes.object
}

export default Routes
