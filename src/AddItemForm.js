import React, { Component } from 'react';

import {extendObservable} from 'mobx';
import {observer} from 'mobx-react';

import { Col, Panel, FormControl, Button } from 'react-bootstrap';
import FontAwesome from 'react-fontawesome';

class AddItemForm extends Component {
  constructor(props) {
    super(props);

    extendObservable(this, {
      input: '',
      changeInput(e) {
        this.input = e.target.value;
      },
      handleAddEvent() {
        if (this.input !== '') {
          this.props.addItem(this.input);
          this.input = '';
        }
      },
      handleKeyPress(e) {
        if (e.key === 'Enter') {
          this.handleAddEvent();
        }
      }
    });
  }

  render() {
    return (
      <Col xs={12} md={4} mdPush={4}>
        <Panel header="Task factory">
          <FormControl
            type="text"
            placeholder="Type in task here"
            onChange={(e) => {this.changeInput(e)}}
            onKeyPress={(e) => {this.handleKeyPress(e)}}
            value={this.input}
          />

          <Button
            className="add-item"
            onClick={this.handleAddEvent.bind(this)}
            bsStyle="primary"
            block
          ><FontAwesome name='plus' /> Add</Button>
        </Panel>
      </Col>
    );
  }
}

export default observer(AddItemForm);
