import {
  DIALOG_HIDE,
  DIALOG_SHOW,
  LOGIN_CHECK,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  SIGNUP_CHECK,
  SIGNUP_SUCCESS,
  SIGNUP_FAIL
} from './../constants/action-types'

export const showDialog = () => {
  return dispatch => {
    dispatch({
      type: DIALOG_SHOW
    })
  }
}

export const hideDialog = () => {
  return dispatch => {
    dispatch({
      type: DIALOG_HIDE
    })
  }
}

export const handleSignupSubmit = payload => {
  return async (dispatch) => {
    dispatch({
      type: SIGNUP_CHECK
    })
    try {
      const response = await fetch(`${process.env.PUBLIC_URL}/api/signup`, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
          username: payload.username,
          email: payload.email,
          password: payload.password
        })
      })
      const json = await response.json()
      await dispatch(successfulSignup(json))
    } catch (err) {
      return dispatch(failedSignup(err))
    }
  }
}

export const handleLoginSubmit = payload => {
  return async (dispatch) => {
    dispatch({
      type: LOGIN_CHECK
    })
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
          username: payload.username,
          email: payload.email,
          password: payload.password
        })
      })
      const res = await response
      const json = await res.json()
      await dispatch(successfulLogin(json))
    } catch (err) {
      return dispatch(failedLogin(err))
    }
  }
}

const successfulSignup = payload => {
  console.log(payload)
  return dispatch => {
    dispatch({
      type: SIGNUP_SUCCESS,
      payload
    })
  }
}

const failedSignup = payload => {
  console.log(payload)
  return dispatch => {
    dispatch({
      type: SIGNUP_FAIL,
      payload
    })
  }
}

const successfulLogin = payload => {
  console.log(payload)
  return dispatch => {
    dispatch({
      type: LOGIN_SUCCESS,
      payload
    })
  }
}

const failedLogin = payload => {
  return dispatch => {
    dispatch({
      type: LOGIN_FAIL,
      payload
    })
  }
}
