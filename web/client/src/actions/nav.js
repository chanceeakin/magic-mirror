import {push} from 'react-router-redux'

export const homePage = () => {
  return dispatch => {
    dispatch(push('/'))
  }
}

export const signUpPage = () => {
  return dispatch => {
    dispatch(push('/signup'))
  }
}

export const authedHomePage = () => {
  return dispatch => {
    dispatch(push('/home'))
  }
}
