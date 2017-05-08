import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { ListGroupItem, FormGroup, InputGroup, FormControl, Button } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

class Item extends Component {
  constructor (props) {
    super(props)

    this.toggleEditing = this.toggleEditing.bind(this)
    this.editTask = this.editTask.bind(this)
    this.removeTask = this.removeTask.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  toggleEditing () {
    this.props.toggleEditingTask(this.props.boxIndex, this.props.index)
    if (!this.props.item.editing) {
      setTimeout(() => ReactDOM.findDOMNode(this.input).focus(), 0)
    }
  }

  editTask () {
    const newValue = ReactDOM.findDOMNode(this.input).value
    this.props.editTask(this.props.boxIndex, this.props.index, newValue)
  }

  removeTask () {
    this.props.removeTask(this.props.boxIndex, this.props.index)
  }

  handleKeyPress (e) {
    if (e.key === 'Enter') {
      this.editTask()
    }
  }

  render () {
    const editing = this.props.item.editing
    let task = null

    if (editing) {
      task =
        <FormGroup>
          <InputGroup>
            <FormControl
              type='text'
              placeholder='Type in task here'
              defaultValue={this.props.item.text}
              onKeyPress={this.handleKeyPress}
              ref={(input) => this.input = input}
            />
            <InputGroup.Button>
              <Button
                bsStyle='success'
                onClick={this.editTask}
              ><FontAwesome name='check' /></Button>
              <Button
                bsStyle='danger'
                onClick={this.toggleEditing}
              ><FontAwesome name='undo' /></Button>
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>
    } else {
      if (this.props.item.id !== 0) {
        task =
          <div>
            <span>{(this.props.index + 1) + '. ' + this.props.item.text}</span>
            <div className='pull-right item-buttons'>
              <Button bsStyle='primary' onClick={this.toggleEditing}>
                <FontAwesome name='pencil' />
              </Button>
              <Button bsStyle='danger' onClick={this.removeTask}>
                <FontAwesome name='remove' />
              </Button>
            </div>
          </div>
      } else {
        task =
          <div className={'empty-box'}>
            <span>{this.props.item.text}</span>
          </div>
      }
    }

    return (
      <ListGroupItem
        key={this.props.index}
      >
        {task}
      </ListGroupItem>
    )
  }
}

export default Item
