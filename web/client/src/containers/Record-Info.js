import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router'

import {withTheme, withStyles} from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Grid from 'material-ui/Grid'

import {
  handleRecordSubmit
} from './../actions/app'
import {
  homePage
} from './../actions/nav'
import RecorderForm from './../components/Recorder-Form'

const mapStateToProps = state => ({
  isDialogOpen: state.app.isDialogOpen
})

const mapDispatchToProps = dispatch => bindActionCreators({
  handleRecordSubmit,
  homePage
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
export default class RecordInfo extends Component {
  static displayName = 'Record-Info'
  static propTypes = {
    classes: PropTypes.object.isRequired,
    homePage: PropTypes.func.isRequired,
    handleRecordSubmit: PropTypes.func.isRequired
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
          <Typography type='display4' className={classes.hero}>Save User Info!</Typography>
        </Grid>
        <Grid item xs={12}>
          <RecorderForm
            homePage={this.props.homePage}
            onSubmit={this.props.handleRecordSubmit}
          />
        </Grid>
      </Grid>
    )
  }
}
