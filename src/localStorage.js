export const loadState = () => {
  try {
    const serializedState = window.localStorage.getItem('tasks')
    if (serializedState === null) {
      return {
        boxes: [
          [], [], [], []
        ]
      }
    }
    return JSON.parse(serializedState)
  } catch (err) {
    return undefined
  }
}

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state)
    window.localStorage.setItem('tasks', serializedState)
  } catch (err) {
    console.log('Something went wrong when saving the state', err)
  }
}
