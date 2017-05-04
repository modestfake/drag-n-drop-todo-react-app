import { combineReducers } from 'redux'

const box = (state, action) => {
  switch (action.type) {
    case 'ADD_TASK':
      return [
        ...state,
        {
          id: new Date().getTime(),
          text: action.value
        }
      ]

    default:
      return state
  }
}

const boxes = (state = [], action) => {
  switch (action.type) {
    case 'ADD_TASK':
      return [
        ...state.slice(0, 2),
        box(state[2], action),
        ...state.slice(3)
      ]
    case 'EDIT_TASK':
      console.log('Edit')
      return state
    case 'REMOVE_TASK':
      console.log('Remove')
      return state
    case 'MOVE_TASK':
      console.log('Move')
      return state
    default:
      return state
  }
}

const reducer = combineReducers({
  boxes
})

export default reducer
