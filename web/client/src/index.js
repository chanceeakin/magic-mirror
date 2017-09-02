import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import store, { history } from './store'
import injectTapEventPlugin from 'react-tap-event-plugin'
import {
  MuiThemeProvider
} from 'material-ui/styles'
import Routes from './routes'
import theme from './theme'

const target = document.querySelector('#root')

injectTapEventPlugin()

render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <ConnectedRouter history={history}>
        <Routes />
      </ConnectedRouter>
    </MuiThemeProvider>
  </Provider>,
  target
)
