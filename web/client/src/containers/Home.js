import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router'

import {withTheme, withStyles} from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Dialog, {
  DialogTitle
} from 'material-ui/Dialog'
import Button from 'material-ui/Button'
import Grid from 'material-ui/Grid'

import {
  showDialog,
  hideDialog,
  handleSubmit
} from './../actions/app'
import logo from './logo.svg'
import LoginForm from './../components/Login-Form'

const mapStateToProps = state => ({
  isDialogOpen: state.app.isDialogOpen
})

const mapDispatchToProps = dispatch => bindActionCreators({
  showDialog,
  hideDialog,
  handleSubmit
}, dispatch)

const styles = theme => ({
  root: {
    textAlign: 'center',
    margin: 0
  },
  logo: {
    animation: 'spin infinite 20s linear',
    height: '80px'
  },
  header: {
    padding: '20px'
  },
  intro: {
    fontSize: 'large'
  },
  button: {
    margin: '1em',
    alignself: 'center',
    justifySelf: 'center'
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
export default class Home extends Component {
  static displayName = 'Login'
  static propTypes = {
    classes: PropTypes.object.isRequired,
    isDialogOpen: PropTypes.bool.isRequired,
    showDialog: PropTypes.func.isRequired,
    hideDialog: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired
  }

  render () {
    const {classes} = this.props
    return (
      <Grid
        container
        className={classes.root}
      >
        <Dialog
          open={this.props.isDialogOpen}
          onRequestClose={this.props.hideDialog}
        >
          <DialogTitle>
            Dialog!
          </DialogTitle>
        </Dialog>
        <Grid
          item
          className={classes.header}
          xs={12}
        >
          <img src={logo} className={classes.logo} alt='logo' />
          <Typography type='display4'>Magic Mirror</Typography>
        </Grid>
        <Grid item xs={12}>
          <Button
            raised
            className={classes.button}
            color='primary'
            onTouchTap={() => this.props.showDialog()}
          >
            Click me!
          </Button>
          <LoginForm
            onSubmit={this.props.handleSubmit}
          />
        </Grid>
      </Grid>
    )
  }
}
