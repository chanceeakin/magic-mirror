import React from 'react'
import { Field, reduxForm } from 'redux-form'
import PropTypes from 'prop-types'

import {withStyles} from 'material-ui/styles'
import Button from 'material-ui/Button'
import Card, {
  CardContent
} from 'material-ui/Card'

import TextFieldComponent from './Login-Text-Field'

const styles = theme => ({
  root: {
    maxWidth: '500px',
    margin: '5em auto 0 auto',
    background: theme.palette.secondary[200]
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

function SignupForm (props) {
  const { handleSubmit, pristine, reset, submitting } = props
  return (
    <Card className={props.classes.root}>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div>
            <Field
              name='username'
              component={TextFieldComponent}
              type='text'
              label='User Name'
            />
          </div>
          <div>
            <Field
              name='email'
              component={TextFieldComponent}
              type='email'
              label='Email'
            />
          </div>
          <div>
            <Field
              name='password'
              type='password'
              component={TextFieldComponent}
              label='Password'
            />
          </div>
          <div className={props.classes.buttonContainer}>
            <Button
              type='submit'
              disabled={pristine || submitting}
              color='primary'
              raised
            >
              Login
            </Button>
            <Button
              type='button'
              disabled={pristine || submitting}
              onClick={reset}
            >
              Clear Values
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

SignupForm.displayName = 'Login-Form'
SignupForm.propTypes = {
  classes: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  reset: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired
}

export default withStyles(styles)(reduxForm({
  form: 'signup' // a unique identifier for this form
})(SignupForm))
