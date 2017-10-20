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
  header: {
    padding: '3em'
  },
  hero: {
    color: theme.palette.primary[500]
  },
  intro: {
    fontSize: 'large'
  }
})

@withStyles(styles)
@withTheme()
@withRouter
@connect(mapStateToProps, mapDispatchToProps)
export default class Home extends Component {
  static displayName = 'Login'
  static propTypes = {
    classes: PropTypes.object.isRequired
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
          <Typography type='display4' className={classes.hero}>Signed In</Typography>
        </Grid>
        <Grid item xs={12} />
      </Grid>
    )
  }
}
