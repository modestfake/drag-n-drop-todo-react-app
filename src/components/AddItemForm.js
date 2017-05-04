import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import { Col, Panel, FormControl, Button } from 'react-bootstrap'
import FontAwesome from 'react-fontawesome'

class AddItemForm extends Component {
  constructor () {
    super()
    this.handleClick = this.handleClick.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }
  handleClick () {
    const inputValue = ReactDOM.findDOMNode(this.refs.input).value

    if (inputValue !== '') {
      this.props.addItem(inputValue)
      ReactDOM.findDOMNode(this.refs.input).value = ''
    }
  }
  handleKeyPress (e) {
    if (e.key === 'Enter') {
      this.handleClick()
    }
  }
  render () {
    return (
      <Col xs={12} md={4} mdPush={4}>
        <Panel header='Task factory'>
          <FormControl
            type='text'
            placeholder='Type task here'
            ref='input'
            onKeyPress={this.handleKeyPress}
          />

          <Button
            onClick={this.handleClick}
            className='add-item'
            bsStyle='primary'
            block
          ><FontAwesome name='plus' /> Add</Button>
        </Panel>
      </Col>
    )
  }
}

export default AddItemForm
