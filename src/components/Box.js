import React, { Component } from 'react'
import {Col, Panel, ListGroup} from 'react-bootstrap'
import Item from './Item.js'
import ItemTypes from '../ItemTypes.js'

import {DropTarget} from 'react-dnd'

const itemTarget = {
  drop (props, monitor, component) {
    const source = monitor.getItem()

    if (source.boxIndex !== props.boxIndex) {
      // props.onDrop(source, props.boxIndex);
    }
  }
}

function collect (connect, monitor) {
  return {connectDropTarget: connect.dropTarget(), isOver: monitor.isOver(), canDrop: monitor.canDrop()}
}

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

  render () {
    const {items, isOver, canDrop, connectDropTarget} = this.props

    let itemsList = null

    if (items.length > 0) {
      itemsList = items.map((item, index) => (
        <Item
          item={item}
          key={index}
          index={index}
          type={ItemTypes.TASK}
          boxIndex={this.props.boxIndex}
          sortInsideBox={this.sortInsideBox.bind(this)}
          {...this.props}
        />
      ))
    } else {
      itemsList = <Item
        item={{
          id: 0,
          text: 'No tasks'
        }}
        type={ItemTypes.TASK}
        boxIndex={this.props.boxIndex}
        sortInsideBox={this.sortInsideBox.bind(this)}
      />
    }

    return connectDropTarget(
      <div>
        <Col xs={12} md={6}>
          <Panel
            header={this.props.heading}
            bsStyle={this.props.bsStyle}
            className={isOver && canDrop ? 'active' : ''}
          >
            <ListGroup fill>
              {itemsList}
            </ListGroup>
          </Panel>
        </Col>
      </div>
    )
  }
}

export default DropTarget(props => props.accepts, itemTarget, collect)(Box)
