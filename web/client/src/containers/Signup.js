import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router'

import {withTheme, withStyles} from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Grid from 'material-ui/Grid'
import Button from 'material-ui/Button'

import {
  handleSignupSubmit,
  graphQLQueryTest
} from './../actions/app'
import {
  homePage
} from './../actions/nav'
import SignupForm from './../components/Signup-Form'

const mapStateToProps = state => ({
  isDialogOpen: state.app.isDialogOpen
})

const mapDispatchToProps = dispatch => bindActionCreators({
  handleSignupSubmit,
  homePage,
  graphQLQueryTest
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
    color: theme.palette.text.primary
  },
  intro: {
    fontSize: 'large'
  }
})

@withStyles(styles)
@withTheme()
@withRouter
@connect(mapStateToProps, mapDispatchToProps)
export default class Signup extends Component {
  static displayName = 'Signup'
  static propTypes = {
    classes: PropTypes.object.isRequired,
    handleSignupSubmit: PropTypes.func.isRequired,
    homePage: PropTypes.func.isRequired,
    graphQLQueryTest: PropTypes.func.isRequired
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
          <Typography type='display4' className={classes.hero}>Sign Up</Typography>
        </Grid>
        <Grid item xs={12}>
          <SignupForm
            onSubmit={this.props.handleSignupSubmit}
            homePage={this.props.homePage}
          />
        </Grid>
        <Button
          onTouchTap={() => this.props.graphQLQueryTest()}
        >Click!</Button>
      </Grid>
    )
  }
}
