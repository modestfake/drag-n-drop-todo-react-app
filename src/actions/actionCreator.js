export const addTask = (value) => ({
  type: 'ADD_TASK',
  value
})

export const editTask = () => ({
  type: 'EDIT_TASK'
})

export const removeTask = () => ({
  type: 'REMOVE_TASK'
})

export const moveTask = () => ({
  type: 'MOVE_TASK'
})
