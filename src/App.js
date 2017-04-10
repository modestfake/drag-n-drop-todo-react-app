import React, { Component } from 'react';

import {extendObservable} from 'mobx';
import {observer} from 'mobx-react';

import ItemContainer from './ItemContainer';
import AddItemForm from './AddItemForm';
import { Grid, Row, Clearfix } from 'react-bootstrap';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import ItemTypes from './ItemTypes.js';

import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    let initialBoxes = [
      {
        heading: 'High priority tasks',
        items: [],
        bsStyle: 'danger'
      },
      {
        heading: 'Middle priority tasks',
        items: [],
        bsStyle: 'warning'
      },
      {
        heading: 'New unsorted tasks',
        items: [],
        bsStyle: 'info'
      },
      {
        heading: 'Low priority tasks',
        items: [],
        bsStyle: 'success'
      },
    ];

    if (window.localStorage.getItem('tasks') === null) {
      window.localStorage.setItem('tasks', JSON.stringify(initialBoxes));
    }

    let boxes = JSON.parse(window.localStorage.getItem('tasks'));

    extendObservable(this, {
      boxes: boxes,
      lastDraggedItem: {}
    });
  }

  addItem(text) {
    this.boxes[2].items.push(text);
    this.saveToLocalStorage();
  }

  moveItem(source, newBox) {
    console.log('Run on drop');
    const droppedItemObj = this.lastDroppedItem;
    // console.log(this.boxes[source.boxIndex].items[source.index]);
    if (this.boxes[newBox].length) {

    } else {
      // this.boxes[source.boxIndex].items.splice(source.index, 1);
      // this.boxes[newBox].items.push(itemToMove);
    }
    // console.log(droppedItemObj, newBox);

    // const itemToMove = this.boxes[source.boxIndex].items[source.index];
    // this.boxes[source.boxIndex].items.splice(source.index, 1);
    // this.boxes[newBox].items.push(itemToMove);

    // this.lastDroppedItem = {};
    // this.saveToLocalStorage();
  }

  moveToAnotherBox(dragIndex, hoverIndex, oldBoxIndex, newBoxIndex) {
    let prevBoxIndex;
    if (typeof this.lastDroppedItem !== 'undefined') {
      prevBoxIndex = this.lastDroppedItem.oldBoxIndex;
    } else {
      prevBoxIndex = oldBoxIndex;
    }
    console.log({dragIndex, hoverIndex, oldBoxIndex, newBoxIndex});

    // const draggedItem = this.boxes[prevBoxIndex].items[oldIndex];
    // this.lastDroppedItem = {oldBoxIndex, draggedItem};

  }

  saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.boxes));
  }

  render() {
    const containers = this.boxes.map((el, index) =>
    <div key={index.toString()}>
      <ItemContainer
        heading={el.heading}
        bsStyle={el.bsStyle}
        accepts={[ItemTypes.TASK]}
        items={el.items}
        boxIndex={index}
        onDrop={this.moveItem.bind(this)}
        saveChanges={this.saveToLocalStorage.bind(this)}
        moveToAnotherBox={this.moveToAnotherBox.bind(this)}
        saveToLocalStorage={this.saveToLocalStorage.bind(this)}
      />
      {index % 2 === 1 && <Clearfix />}
      </div>
    );
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Drag'n'drop todo list</h2>
        </div>
        <Grid className="todo-panel">
          <Row>
            <AddItemForm addItem={this.addItem.bind(this)} />
          </Row>
          <Row>
            {containers}
          </Row>
        </Grid>
      </div>
    );
  }
}

export default DragDropContext(HTML5Backend)(observer(App));
