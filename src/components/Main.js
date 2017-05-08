import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import Box from './Box'
import AddItemForm from './AddItemForm'
import { Grid, Row, Clearfix } from 'react-bootstrap'
import Dragula from 'react-dragula'

import ItemTypes from '../ItemTypes.js'

import logo from '../logo.svg'
import '../App.css'

const boxesMeta = [
  {
    heading: 'High priority tasks',
    bsStyle: 'danger'
  },
  {
    heading: 'Middle priority tasks',
    bsStyle: 'warning'
  },
  {
    heading: 'New unsorted tasks',
    bsStyle: 'info'
  },
  {
    heading: 'Low priority tasks',
    bsStyle: 'success'
  }
]

class Main extends Component {
  saveToLocalStorage () {
    window.localStorage.setItem('tasks', JSON.stringify(this.boxes))
  }

  componentDidMount () {
    let containers = []
    const refKeys = Object.keys(this.refs)
    refKeys.forEach((key, index) => {
      const listComponent = this.refs[key].refs[`list${index}`]
      ReactDOM.findDOMNode(listComponent).setAttribute('boxIndex', index)
      containers.push(ReactDOM.findDOMNode(listComponent))
    })

    const options = {
      moves: (el) => {
        return !el.childNodes[0].classList.contains('empty-box')
      }
    }
    const dragula = Dragula(containers, options)
    dragula.on('drop', (el, target, source, sibling) => {
      const prevBoxIndex = Number(source.getAttribute('boxIndex'))
      const newBoxIndex = Number(target.getAttribute('boxIndex'))
      const prevItemIndex = Number(el.getAttribute('itemIndex'))
      let newItemIndex
      if (sibling == null) {
        newItemIndex = this.props.boxes[newBoxIndex].length - 1
      } else {
        newItemIndex = Number(sibling.getAttribute('itemIndex')) > prevItemIndex
          ? Number(sibling.getAttribute('itemIndex')) - 1
          : Number(sibling.getAttribute('itemIndex'))
      }

      this.props.moveTask(prevBoxIndex, newBoxIndex, prevItemIndex, newItemIndex)
    })
  }

  componentWillUpdate () {
    console.log('will update')
  }

  componentWillReceiveProps (nextProps) {
    console.log(nextProps)
  }

  render () {
    const containers = boxesMeta.map((el, index) =>
      <div key={index.toString()}>
        <Box
          heading={el.heading}
          bsStyle={el.bsStyle}
          accepts={[ItemTypes.TASK]}
          items={this.props.boxes[index]}
          boxIndex={index}
          ref={`box${index}`}
          {...this.props}
        />
        {index % 2 === 1 && <Clearfix />}
      </div>
    )

    return (
      <div className='App'>
        <div className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h2>Drag'n'drop todo list</h2>
        </div>
        <Grid className='todo-panel'>
          <Row>
            <AddItemForm addItem={this.props.addTask} />
          </Row>
          <Row ref={row => this.boxes = row}>
            {containers}
          </Row>
        </Grid>
      </div>
    )
  }
}

export default Main
