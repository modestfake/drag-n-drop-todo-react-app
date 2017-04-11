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
      // props.onDrop(source, props.boxIndex);
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
        this.items[index].text = value;
        this.props.saveChanges();
      },
      removeItem(index) {
        this.items.splice(index, 1);
        this.props.saveChanges();
      },
      sortInsideBox(dragIndex, hoverIndex, oldBoxIndex, itemId) {
        const newBoxIndex = this.props.boxIndex;
        if (newBoxIndex === oldBoxIndex) {
          if (typeof dragIndex !== 'undefined') {
            const currentItem = this.items[dragIndex];
            this.items.splice(dragIndex, 1);
            this.items.splice(hoverIndex, 0, currentItem);

            this.props.saveChanges();
          }
        } else {
          this.props.moveToAnotherBox(dragIndex, hoverIndex, oldBoxIndex, newBoxIndex, itemId);
        }
      }
    });
  }

  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    lastDroppedItem: PropTypes.object
  };

  render() {
    const { isOver, canDrop, connectDropTarget } = this.props;

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
          sortInsideBox={this.sortInsideBox.bind(this)}
        />
      );
    } else {
      items = <Item
        item={{id: 0, text: 'No tasks'}}
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
            {items}
          </ListGroup>
          </Panel>
        </Col>
      </div>
    );
  }
}

export default DropTarget(props => props.accepts, itemTarget, collect)(observer(ItemContainer));
