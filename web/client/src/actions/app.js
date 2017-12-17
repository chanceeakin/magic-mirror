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
  SUCCESSFUL_REQUEST,
  APP_BAR_CHECK,
  RECORD_QUERY_BEGIN,
  RECORD_QUERY_SUCCESS,
  RECORD_QUERY_FAIL
} from './../constants/action-types'
import {authedHomePage} from './nav'

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
      const response = await fetch(`${process.env.PUBLIC_URL}/api/login`, {
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
      await dispatch(handleLogin({
        status: res.status,
        json
      }))
    } catch (err) {
      return dispatch(failedLogin(err))
    }
  }
}

const handleLogin = payload => {
  console.log(payload)
  return dispatch => {
    if (payload.status === 200 && payload.json.username) {
      dispatch(successfulLogin(payload.json))
      dispatch(authedHomePage())
    } else {
      dispatch(failedLogin(payload))
    }
  }
}

const successfulSignup = payload => {
  return dispatch => {
    dispatch({
      type: SIGNUP_SUCCESS,
      payload
    })
  }
}

const failedSignup = payload => {
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
      await dispatch(handleRequest(json.data))
    } catch (err) {
      return dispatch(failedRequest(err))
    }
  }
}

const handleRequest = payload => {
  console.log(payload)
  return dispatch => {
    if (!payload.error) {
      dispatch(successfulRequest(payload))
    } else {
      dispatch(failedRequest(payload))
    }
  }
}

export const successfulRequest = payload => {
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

export const checkAppBar = payload => {
  return dispatch => {
    if (payload === '/home') {
      dispatch({
        type: APP_BAR_CHECK,
        payload: true
      })
    } else {
      dispatch({
        type: APP_BAR_CHECK,
        payload: false
      })
    }
  }
}

export const handleRecordSubmit = payload => {
  console.log(payload)
  return dispatch => {
    dispatch({
      type: RECORD_QUERY_BEGIN
    })
  }
}

export const recordQuerySuccess = () => {
  return dispatch => {
    dispatch({
      type: RECORD_QUERY_SUCCESS
    })
  }
}

export const recordQueryFail = () => {
  return dispatch => {
    dispatch({
      type: RECORD_QUERY_FAIL
    })
  }
}
