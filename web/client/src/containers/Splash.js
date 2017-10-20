import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router'

import {withTheme, withStyles} from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Grid from 'material-ui/Grid'

import {
  handleLoginSubmit
} from './../actions/app'
import {
  signUpPage
} from './../actions/nav'

import LoginForm from './../components/Login-Form'
import mp4 from './../constants/videos/Perfect_Hour.mp4'
import webm from './../constants/videos/Perfect_Hour.webm'

const mapStateToProps = state => ({
  isDialogOpen: state.app.isDialogOpen
})

const mapDispatchToProps = dispatch => bindActionCreators({
  handleLoginSubmit,
  signUpPage
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
    padding: '3em'
  },
  hero: {
    color: theme.palette.primary[50]
  },
  intro: {
    fontSize: 'large'
  },
  video: {
    position: 'fixed',
    right: 0,
    bottom: 0,
    minWidth: '100%',
    minHeight: '100%',
    width: 'auto',
    height: 'auto',
    zIndex: '-100'
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
    handleLoginSubmit: PropTypes.func.isRequired,
    signUpPage: PropTypes.func.isRequired
  }

  render () {
    const {classes} = this.props
    return (
      <Grid
        container
        className={classes.root}
        spacing={0}
      >
        <Grid
          item
          className={classes.header}
          xs={12}
        >
          <video autoPlay loop className={classes.video}>
            <source src={mp4} type='video/mp4' />
            <source src={webm} type='video/webm' />
          </video>
          <Typography type='display4' className={classes.hero}>Magic Mirror</Typography>
        </Grid>
        <Grid item xs={12}>
          <LoginForm
            onSubmit={this.props.handleLoginSubmit}
            signUpPage={this.props.signUpPage}
          />
        </Grid>
      </Grid>
    )
  }
}
