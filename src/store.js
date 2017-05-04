import { createStore } from 'redux'
import reducer from './reducers/'

const lsData = window.localStorage.getItem('tasks')

const defaultState = {
  boxes: [
    [], [], [], []
  ]
}

const initialState = lsData !== null ? lsData : defaultState

const store = createStore(reducer, initialState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())

export default store
