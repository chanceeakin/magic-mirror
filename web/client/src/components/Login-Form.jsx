import React from 'react'
import { Field, reduxForm } from 'redux-form'
import PropTypes from 'prop-types'

import {withStyles} from 'material-ui/styles'
import Button from 'material-ui/Button'

import TextFieldComponent from './Login-Text-Field'

const styles = theme => ({
  buttonContainer: {
    padding: '1em'
  }
})

function LoginForm (props) {
  const { handleSubmit, pristine, reset, submitting } = props
  return (
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
  )
}

LoginForm.displayName = 'Login-Form'
LoginForm.propTypes = {
  classes: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  reset: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired
}

export default withStyles(styles)(reduxForm({
  form: 'login' // a unique identifier for this form
})(LoginForm))
