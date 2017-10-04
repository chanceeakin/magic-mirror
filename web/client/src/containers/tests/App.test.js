import React from 'react'
import {shallow} from 'enzyme'
import {MuiThemeProvider} from 'material-ui/styles'
import {assert} from 'chai'
import App from './../App'
import theme from './../../theme'

// want better mocks? write 'em yourself. I want the squawk to go away.
const mockProps = {
  classes: {},
  isDialogOpen: false,
  showDialog: () => {
    console.log('showDialog');
  },
  hideDialog: () => {
    console.log('hideDialog');
  }
}

it('renders without crashing', () => {
  const wrapper = shallow(
    <MuiThemeProvider theme={theme}>
      <App {...mockProps}/>
    </MuiThemeProvider>
  )
  assert.ok(wrapper)
})
