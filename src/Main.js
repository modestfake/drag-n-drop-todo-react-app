import React, { Component } from 'react'

import Box from './Box'
import AddItemForm from './components/AddItemForm'
import { Grid, Row, Clearfix } from 'react-bootstrap'

import ItemTypes from './ItemTypes.js'

import logo from './logo.svg'
import './App.css'

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
          <Row>
            {containers}
          </Row>
        </Grid>
      </div>
    )
  }
}

export default Main
