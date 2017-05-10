import { combineReducers } from 'redux'

const box = (state, action) => {
  switch (action.type) {
    case 'ADD_TASK':
      return [
        ...state,
        action.item
      ]
    case 'TOGGLE_EDITING_TASK':
      return state.map((item, index) => {
        if (index !== action.taskIndex) {
          return item
        }

        return {
          ...item,
          editing: !item.editing
        }
      })
    case 'EDIT_TASK':
      return state.map((item, index) => {
        if (index !== action.taskIndex) {
          return item
        }

        return {
          ...item,
          text: action.value,
          editing: !item.editing
        }
      })
    case 'REMOVE_TASK':
      return state.filter((item, index) => index !== action.taskIndex)
    default:
      return state
  }
}

const boxes = (state = [], action) => {
  const boxIndex = typeof action.box !== 'undefined'
    ? action.box
    : undefined

  switch (action.type) {
    case 'ADD_TASK':
      return [
        ...state.slice(0, 2),
        box(state[2], action),
        ...state.slice(3)
      ]
    case 'TOGGLE_EDITING_TASK':
      return [
        ...state.slice(0, boxIndex),
        box(state[boxIndex], action),
        ...state.slice(boxIndex + 1)
      ]
    case 'EDIT_TASK':
      return [
        ...state.slice(0, boxIndex),
        box(state[boxIndex], action),
        ...state.slice(boxIndex + 1)
      ]
    case 'REMOVE_TASK':
      return [
        ...state.slice(0, boxIndex),
        box(state[boxIndex], action),
        ...state.slice(boxIndex + 1)
      ]
    case 'MOVE_TASK':
      let draggedItem = null
      const updatedPrevBox = state[action.prevBoxIndex].filter((item, index) => {
        if (action.prevItemIndex === index) {
          draggedItem = Object.assign({}, item)
          return false
        }
        return item
      })
      const newArrayWithoutItem = [
        ...state.slice(0, action.prevBoxIndex),
        updatedPrevBox,
        ...state.slice(action.prevBoxIndex + 1)
      ]
      const updatedTargetBox = [
        ...newArrayWithoutItem[action.newBoxIndex].slice(0, action.newItemIndex),
        draggedItem,
        ...newArrayWithoutItem[action.newBoxIndex].slice(action.newItemIndex)
      ]
      console.log([
        ...newArrayWithoutItem.slice(0, action.newBoxIndex),
        updatedTargetBox,
        ...newArrayWithoutItem.slice(action.newBoxIndex + 1)
      ])
      return [
        ...newArrayWithoutItem.slice(0, action.newBoxIndex),
        updatedTargetBox,
        ...newArrayWithoutItem.slice(action.newBoxIndex + 1)
      ]
    default:
      return state
  }
}

const reducer = combineReducers({
  boxes
})

export default reducer
