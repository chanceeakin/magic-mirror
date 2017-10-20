import {
  DIALOG_HIDE,
  DIALOG_SHOW,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  APP_BAR_CHECK
} from './../constants/action-types'

const initialState = {
  isDialogOpen: false,
  isUserAuthed: false,
  error: null,
  isAppBarShown: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case DIALOG_SHOW:
      return {
        ...state,
        isDialogOpen: true
      }
    case DIALOG_HIDE:
      return {
        ...state,
        isDialogOpen: false
      }
    case LOGIN_SUCCESS:
      return {
        ...state,
        isUserAuthed: true
      }
    case LOGIN_FAIL:
      return {
        ...state,
        isUserAuthed: false
      }
    case APP_BAR_CHECK:
      return {
        ...state,
        isAppBarShown: action.payload
      }
    default:
      return state
  }
}
