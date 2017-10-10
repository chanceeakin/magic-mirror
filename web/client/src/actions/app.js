import {
  DIALOG_HIDE,
  DIALOG_SHOW,
  LOGIN_CHECK,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  SIGNUP_CHECK,
  SIGNUP_SUCCESS,
  SIGNUP_FAIL,
  BEGIN_QUERY,
  FAILED_REQUEST,
  SUCCESSFUL_REQUEST
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
      const response = await fetch(`${process.env.PUBLIC_URL}/auth/password/register`, {
        method: 'POST',
        headers: new Headers({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
          login: payload.email,
          password: payload.password
        })
      })
      const res = await response
      console.log(res)
      const json = await res.json()
      console.log(json)
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
      const response = await fetch(`${process.env.PUBLIC_URL}/auth/password/login`, {
        method: 'POST',
        headers: new Headers({
          'Data-Type': 'text',
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }),
        body: {
          login: payload.email,
          password: payload.password
        }
      })
      const res = await response.json()
      await dispatch(successfulLogin(res))
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

export const graphQLQueryTest = () => {
  return async dispatch => {
    dispatch({
      type: BEGIN_QUERY
    })
    const query = `query { hello
        }`
    try {
      const response = await fetch(`${process.env.PUBLIC_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          query: query
        })
      })
      const json = await response.json()
      await dispatch(successfulRequest(json.data))
    } catch (err) {
      return dispatch(failedRequest(err))
    }
  }
}

export const successfulRequest = payload => {
  console.log(payload)
  return dispatch => {
    dispatch({
      type: SUCCESSFUL_REQUEST
    })
  }
}

export const failedRequest = payload => {
  console.log(payload)
  return dispatch => {
    dispatch({
      type: FAILED_REQUEST
    })
  }
}
