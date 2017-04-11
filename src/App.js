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
      boxes: boxes
    });
  }

  addItem(text) {
    const id = new Date().getTime();
    this.boxes[2].items.push({id, text});
    this.saveToLocalStorage();
  }

  findTaskById(itemId, oldBoxIndex) {
    if (this.boxes[oldBoxIndex].items.length === 0) {
      return false;
    }

    this.boxes[oldBoxIndex].items.findIndex((el) => el.id === itemId);

    return false;
  }

  moveToAnotherBox(dragIndex, hoverIndex, oldBoxIndex, newBoxIndex, itemId) {
    if (typeof hoverIndex === 'undefined' && !this.boxes[newBoxIndex].items.length) {
      const currentItem = this.boxes[oldBoxIndex].items[dragIndex];
      if (currentItem.id === itemId) {
        this.boxes[oldBoxIndex].items.splice(dragIndex, 1);
        this.boxes[newBoxIndex].items.push(currentItem);
      }
    } else {
      if (typeof dragIndex !== 'undefined' && this.boxes[oldBoxIndex].items.length) {
        const currentItem = this.boxes[oldBoxIndex].items[dragIndex];
        if (currentItem.id === itemId) {
          this.boxes[oldBoxIndex].items.splice(dragIndex, 1);
          this.boxes[newBoxIndex].items.splice(hoverIndex, 0, currentItem);
        }

        // console.log('Before:', oldBoxIndex);
        // if (!this.findTaskById(itemId, oldBoxIndex)) {
        //   oldBoxIndex = newBoxIndex;
        // }
        // console.log('After:', oldBoxIndex);
      }
    }

    this.saveToLocalStorage();
  }

  saveToLocalStorage() {
    window.localStorage.setItem('tasks', JSON.stringify(this.boxes));
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
        saveChanges={this.saveToLocalStorage}
        moveToAnotherBox={this.moveToAnotherBox.bind(this)}
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
