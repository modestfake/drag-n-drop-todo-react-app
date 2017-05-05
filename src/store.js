import { createStore } from 'redux'
import reducer from './reducers/'
import { loadState, saveState } from './localStorage'
import throttle from 'lodash.throttle'

const initialState = loadState()

const store = createStore(
  reducer,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

store.subscribe(throttle(() => {
  saveState(store.getState())
  console.log('Saved')
}), 1000)

export default store
