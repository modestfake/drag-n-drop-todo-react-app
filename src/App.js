import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actionCreators from './actions/actionCreator'
import Main from './Main'

import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

const mapStateToProps = (state) => {
  return {
    boxes: state.boxes
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(actionCreators, dispatch)
}

const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(Main)

export default DragDropContext(HTML5Backend)(App)
