import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router'
import {withTheme, withStyles} from 'material-ui/styles'
import Routes from './../routes'

import {
  showDialog,
  hideDialog
} from './../actions/app'
// import AppBar from './../components/App-Bar'

const mapStateToProps = state => ({
  isDialogOpen: state.app.isDialogOpen
})

const mapDispatchToProps = dispatch => bindActionCreators({
  showDialog,
  hideDialog
}, dispatch)

const styles = theme => ({
  '@global': {
    margin: 0,
    body: {
      margin: 0
    }
  },
  app: {
    textAlign: 'center',
    margin: 0
  },
  logo: {
    animation: 'spin infinite 20s linear',
    height: '80px'
  },
  header: {
    height: '150px',
    padding: '20px'
  },
  intro: {
    fontSize: 'large'
  },
  button: {
    margin: '1em'
  },
  '@keyframes spin': {
    from: {
      transform: 'rotate(0deg)'
    },
    to: {
      transform: 'rotate(360deg)'
    }
  }
})

@withStyles(styles)
@withTheme()
@withRouter
@connect(mapStateToProps, mapDispatchToProps)
export default class App extends Component {
  static displayName = 'App'
  static propTypes = {
    classes: PropTypes.object.isRequired
  }

  render () {
    const {classes} = this.props
    return (
      <div className={classes.app}>
        {/* <AppBar /> */}
        <main>
          <Routes />
        </main>
      </div>
    )
  }
}
