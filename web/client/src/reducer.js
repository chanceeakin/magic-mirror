import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import app from './reducers/app'
import { reducer as reduxFormReducer } from 'redux-form'

export default combineReducers({
  routing: routerReducer,
  app,
  form: reduxFormReducer
})
