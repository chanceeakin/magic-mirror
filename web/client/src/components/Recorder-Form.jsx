import React from 'react'
import { Field, reduxForm } from 'redux-form'
import PropTypes from 'prop-types'

import {withStyles} from 'material-ui/styles'
import Button from 'material-ui/Button'
import Card, {
  CardContent
} from 'material-ui/Card'
import Typography from 'material-ui/Typography'

import TextFieldComponent from './Login-Text-Field'

const styles = theme => ({
  root: {
    maxWidth: '500px',
    margin: '5em auto 0 auto',
    background: theme.palette.secondary[50]
  },
  buttonContainer: {
    padding: '1em'
  },
  link: {
    color: theme.palette.text.primary,
    textDecoration: 'none',
    cursor: 'pointer'
  }
})

const required = value => (value ? undefined : 'Required')
const alphaNumeric = value =>
  value && /[^a-zA-Z0-9]/i.test(value)
    ? 'Only alphanumeric characters'
    : undefined

function RecorderForm (props) {
  const { handleSubmit, pristine, reset, submitting } = props
  return (
    <Card className={props.classes.root}>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Typography>Add a name to save for your magic mirror account!</Typography>
          <div>
            <Field
              name='name'
              component={TextFieldComponent}
              type='text'
              label='Name'
              validate={[required, alphaNumeric]}
            />
          </div>
          <div className={props.classes.buttonContainer}>
            <Button
              type='submit'
              disabled={pristine || submitting}
              color='primary'
              raised
            >
              Save Info
            </Button>
            <Button
              type='button'
              disabled={pristine || submitting}
              onClick={reset}
            >
              Clear Value
            </Button>
          </div>
        </form>
        <a
          onTouchTap={props.homePage}
          className={props.classes.link}
        ><Typography>Home</Typography></a>
      </CardContent>
    </Card>
  )
}

RecorderForm.displayName = 'Recorder-Form'
RecorderForm.propTypes = {
  classes: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  reset: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  homePage: PropTypes.func.isRequired
}

export default withStyles(styles)(reduxForm({
  form: 'recorder' // a unique identifier for this form
})(RecorderForm))
