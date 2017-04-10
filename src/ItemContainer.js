import React, { Component, PropTypes } from 'react';
import { Col, Panel, ListGroup } from 'react-bootstrap';
import Item from './Item.js';
import ItemTypes from './ItemTypes.js';

import { DropTarget } from 'react-dnd';

import {extendObservable} from 'mobx';
import {observer} from 'mobx-react';

const itemTarget = {
  drop(props, monitor, component) {
    const source = monitor.getItem();

    if (source.boxIndex !== props.boxIndex) {
      props.onDrop(source, props.boxIndex);
    }
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  }
}


class ItemContainer extends Component {
  constructor(props) {
    super(props);

    extendObservable(this, {
      items: this.props.items,
      editItem(index, value) {
        this.items[index] = value;
        this.props.saveChanges();
      },
      removeItem(index) {
        this.items.splice(index, 1);
        this.props.saveChanges();
      },
      moveItem(dragIndex, hoverIndex, oldBoxIndex) {
        // if (oldBoxIndex === this.props.boxIndex) {
        //   const dragItem = this.items[dragIndex];
        //   this.items.splice(dragIndex, 1);
        //   this.items.splice(hoverIndex, 0 , dragItem);
        //
        //   this.props.saveToLocalStorage();
        // } else {
          this.props.moveToAnotherBox(dragIndex, hoverIndex, oldBoxIndex, this.props.boxIndex);
        // }

        // this.setTempDraggingItem(oldBoxIndex, hoverIndex);
      },
      setTempDraggingItem(oldBoxIndex, oldIndex) {
        this.props.moveToAnotherBox(oldBoxIndex, oldIndex);
      }
    });
  }

  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    lastDroppedItem: PropTypes.object,
    onDrop: PropTypes.func.isRequired
  };

  render() {
    const { isOver, canDrop, connectDropTarget, lastDroppedItem } = this.props;

    let items = null;

    if (this.items.length > 0) {
      items = this.items.map((item, index) =>
        <Item
          item={item}
          key={index}
          index={index}
          type={ItemTypes.TASK}
          boxIndex={this.props.boxIndex}
          editItem={this.editItem.bind(this)}
          removeItem={this.removeItem.bind(this)}
          moveItem={this.moveItem.bind(this)}
          setTempDraggingItem={this.setTempDraggingItem.bind(this)}
        />
      );
    } else {
      items = <Item
        item={'No tasks'}
        type={ItemTypes.TASK}
        boxIndex={this.props.boxIndex}
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
            {items}
          </ListGroup>
          </Panel>
        </Col>
      </div>
    );
  }
}

export default DropTarget(props => props.accepts, itemTarget, collect)(observer(ItemContainer));
