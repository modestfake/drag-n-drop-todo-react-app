export const addTask = (value) => ({
  type: 'ADD_TASK',
  item: {
    id: new Date().valueOf(),
    text: value,
    editing: false
  }
})

export const toggleEditingTask = (box, taskIndex) => ({
  type: 'TOGGLE_EDITING_TASK',
  box,
  taskIndex
})

export const editTask = (box, taskIndex, value) => ({
  type: 'EDIT_TASK',
  box,
  taskIndex,
  value
})

export const removeTask = (box, taskIndex) => ({
  type: 'REMOVE_TASK',
  box,
  taskIndex
})

export const moveTask = (prevBoxIndex, newBoxIndex, prevItemIndex, newItemIndex) => ({
  type: 'MOVE_TASK',
  prevBoxIndex,
  newBoxIndex,
  prevItemIndex,
  newItemIndex
})
