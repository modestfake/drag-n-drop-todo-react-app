import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';
import { ListGroupItem, FormGroup, InputGroup, FormControl, Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

import {extendObservable} from 'mobx';
import {observer} from 'mobx-react';

import { DragSource, DropTarget } from 'react-dnd';

const itemSource = {
  beginDrag(props, monitor) {
    return {
      boxIndex: props.boxIndex,
      index: props.index,
      id: props.item.id
    };
  },
  endDrag(props, monitor) {
    return {
      boxIndex: props.boxIndex,
      index: props.index,
      id: props.item.id
    };
  }
};

const itemTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const oldBoxIndex = monitor.getItem().boxIndex;
    const itemId = monitor.getItem().id;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    props.sortInsideBox(dragIndex, hoverIndex, oldBoxIndex, itemId);

    monitor.getItem().index = hoverIndex;
  }
};

function collectSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  };
}

function collectTarget(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
}

class Item extends Component {
  constructor(props) {
    super(props);

    extendObservable(this, {
      input: this.props.item.text,
      editing: false,
      changeInput(e) {
        this.input = e.target.value;
      },
      toggleEditing() {
        this.editing = !this.editing;
      },
      handleEditEvent() {
        if (this.input !== '') {
          this.props.editItem(this.props.index, this.input);
          this.toggleEditing();
        }
      }
    });
  }

  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
    boxIndex: PropTypes.number.isRequired,
    isDropped: PropTypes.bool.isRequired,
  };

  render() {
    const { isDragging, connectDragSource, connectDropTarget } = this.props;

    let task = null;


    if (this.editing) {
      task =
        <FormGroup>
          <InputGroup>
            <FormControl
              type="text"
              placeholder="Type in task here"
              onChange={(e) => {this.changeInput(e)}}
              value={this.input}
            />
            <InputGroup.Button>
              <Button
                bsStyle="success"
                onClick={this.handleEditEvent.bind(this)}
              ><FontAwesome name='check' /></Button>
              <Button
                bsStyle="danger"
                onClick={this.toggleEditing.bind(this)}
              ><FontAwesome name='undo' /></Button>
            </InputGroup.Button>
          </InputGroup>
        </FormGroup>
    } else {
      if (this.props.item.id !== 0) {
        task =
          connectDragSource(connectDropTarget(
            <div className={isDragging ? 'draggin' : ''}>
              <span>{(this.props.index + 1) + '. ' + this.props.item.text}</span>
              <div className="pull-right item-buttons">
                <Button bsStyle="primary" onClick={this.toggleEditing.bind(this)}>
                  <FontAwesome name='pencil' />
                </Button>
                <Button bsStyle="danger" onClick={() => this.props.removeItem(this.props.index)}>
                  <FontAwesome name='remove' />
                </Button>
              </div>
            </div>
          ));
      } else {
        task =
          connectDropTarget(
            <div className={'empty-box'}>
              <span>{this.props.item.text}</span>
            </div>
          );
      }
    }

    return (
      <ListGroupItem
        key={this.props.index}
      >
        {task}
      </ListGroupItem>
    );
  }
}

Item.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
};

export default DragSource(props => props.type, itemSource, collectSource)(DropTarget(props => props.type, itemTarget, collectTarget)(observer(Item)));
