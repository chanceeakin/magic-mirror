import {
  DIALOG_HIDE,
  DIALOG_SHOW
} from './../constants/action-types'

const initialState = {
  isDialogOpen: false
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
    default:
      return state
  }
}
