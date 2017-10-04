import {
  DIALOG_HIDE,
  DIALOG_SHOW,
  LOGIN_CHECK,
  LOGIN_SUCCESS,
  LOGIN_FAIL
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

export const handleSubmit = payload => {
  return async (dispatch) => {
    dispatch({
      type: LOGIN_CHECK
    })
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        body: {
          username: payload.username,
          password: payload.password
        }
      })
      const json = await response.json()
      await dispatch(successfulRequest(json.data))
    } catch (err) {
      return dispatch(failedRequest(err))
    }
  }
}

const successfulRequest = payload => {
  return dispatch => {
    dispatch({
      type: LOGIN_SUCCESS,
      payload
    })
  }
}

const failedRequest = payload => {
  return dispatch => {
    dispatch({
      type: LOGIN_FAIL,
      payload
    })
  }
}
