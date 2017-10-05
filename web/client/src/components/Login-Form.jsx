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
    margin: '5em auto 0 auto'
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

function LoginForm (props) {
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
        <a
          onTouchTap={() => props.signUpPage()}
          className={props.classes.link}
        ><Typography>Create an account</Typography></a>
      </CardContent>
    </Card>
  )
}

LoginForm.displayName = 'Login-Form'
LoginForm.propTypes = {
  classes: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  reset: PropTypes.func.isRequired,
  submitting: PropTypes.bool.isRequired,
  signUpPage: PropTypes.func.isRequired
}

export default withStyles(styles)(reduxForm({
  form: 'login' // a unique identifier for this form
})(LoginForm))
