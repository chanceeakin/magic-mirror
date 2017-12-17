import React from 'react'
import PropTypes from 'prop-types'

import TextField from 'material-ui/TextField'

function LoginTextField ({
  input,
  label,
  meta: { touched, error },
  ...custom
}) {
  return (
    <TextField
      label={label}
      error={touched && !!error}
      {...input}
      {...custom}
    />
  )
}

LoginTextField.displayName = 'Login-Text-Field'
LoginTextField.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  meta: PropTypes.object.isRequired
}

export default LoginTextField
