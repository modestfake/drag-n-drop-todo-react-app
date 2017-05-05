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
  addItem (text) {
    const id = new Date().getTime()
    this.boxes[2].items.push({id, text})
    this.saveToLocalStorage()
  }

  findTaskById (itemId, oldBoxIndex) {
    if (this.boxes[oldBoxIndex].items.length === 0) {
      return false
    }

    this.boxes[oldBoxIndex].items.findIndex((el) => el.id === itemId)

    return false
  }

  moveToAnotherBox (dragIndex, hoverIndex, oldBoxIndex, newBoxIndex, itemId) {
    if (typeof hoverIndex === 'undefined' && !this.boxes[newBoxIndex].items.length) {
      const currentItem = this.boxes[oldBoxIndex].items[dragIndex]
      if (currentItem.id === itemId) {
        this.boxes[oldBoxIndex].items.splice(dragIndex, 1)
        this.boxes[newBoxIndex].items.push(currentItem)
      }
    } else {
      if (typeof dragIndex !== 'undefined' && this.boxes[oldBoxIndex].items.length) {
        const currentItem = this.boxes[oldBoxIndex].items[dragIndex]
        if (currentItem.id === itemId) {
          this.boxes[oldBoxIndex].items.splice(dragIndex, 1)
          this.boxes[newBoxIndex].items.splice(hoverIndex, 0, currentItem)
        }

        // console.log('Before:', oldBoxIndex);
        // if (!this.findTaskById(itemId, oldBoxIndex)) {
        //   oldBoxIndex = newBoxIndex;
        // }
        // console.log('After:', oldBoxIndex);
      }
    }

    this.saveToLocalStorage()
  }

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

    const options = {}
    const dragula = Dragula(containers, options)
    // console.log(container)
    dragula.on('drop', (el, target, source, sibling) => {
      console.log({el, target, source, sibling})
      const prevBoxIndex = Number(source.getAttribute('boxIndex'))
      const newBoxIndex = Number(target.getAttribute('boxIndex'))
      const prevItemIndex = Number(el.getAttribute('boxIndex'))
      const newItemIndex = Number(sibling.getAttribute('boxIndex') - 1)
      console.log({prevBoxIndex, newBoxIndex, prevItemIndex, newItemIndex})
      // Fix sibling nu,ber
    })
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
          saveChanges={this.saveToLocalStorage}
          moveToAnotherBox={this.moveToAnotherBox.bind(this)}
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