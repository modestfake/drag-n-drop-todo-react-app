import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import {Col, Panel, ListGroup} from 'react-bootstrap'
import Item from './Item.js'

class Box extends Component {
  sortInsideBox (dragIndex, hoverIndex, oldBoxIndex, itemId) {
    const newBoxIndex = this.props.boxIndex
    if (newBoxIndex === oldBoxIndex) {
      if (typeof dragIndex !== 'undefined') {
        const currentItem = this.items[dragIndex]
        this.items.splice(dragIndex, 1)
        this.items.splice(hoverIndex, 0, currentItem)

        this.props.saveChanges()
      }
    } else {
      this.props.moveToAnotherBox(dragIndex, hoverIndex, oldBoxIndex, newBoxIndex, itemId)
    }
  }

  componentDidMount () {
    const refKeys = Object.keys(this.refs)
    refKeys.forEach((key, index) => {
      if (key.indexOf('item') !== -1) {
        const itemComponent = this.refs[key]
        ReactDOM.findDOMNode(itemComponent).setAttribute('itemIndex', index)
      }
    })
  }

  componentDidUpdate () {
    // const refKeys = Object.keys(this.refs)
    // refKeys.forEach((key, index) => {
    //   if (key.indexOf('item') !== -1) {
    //     const itemComponent = this.refs[key]
    //     let child = ReactDOM.findDOMNode(itemComponent)
    //     let i = 0
    //     while ((child = child.previousSibling) != null) {
    //       i++
    //     }
    //     // console.log(i)
    //     ReactDOM.findDOMNode(itemComponent).setAttribute('itemIndex', i)
    //   }
    // })
  }

  render () {
    let itemsList = null

    if (this.props.items.length > 0) {
      itemsList = this.props.items.map((item, index) => {
        // console.log(index)

        return (
          <Item
            item={item}
            key={index}
            index={index}
            boxIndex={this.props.boxIndex}
            ref={`item${index}`}
            {...this.props}
          />
        )
      })
    } else {
      itemsList = <Item
        item={{
          id: 0,
          text: 'No tasks'
        }}
        boxIndex={this.props.boxIndex}
      />
    }

    return (
      <div>
        <Col xs={12} md={6}>
          <Panel
            header={this.props.heading}
            bsStyle={this.props.bsStyle}
            // className={isOver && canDrop ? 'active' : ''}
          >
            <ListGroup fill ref={`list${this.props.boxIndex}`}>
              {itemsList}
            </ListGroup>
          </Panel>
        </Col>
      </div>
    )
  }
}

export default Box
