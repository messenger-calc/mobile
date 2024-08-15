import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';

import Button from './components/Button';
import Display from './components/Display';
import { CalculatorScreenProps, TState } from './types';

let variableA: number;
let variableB: number;
let result: number;

export default class Calculator extends Component<CalculatorScreenProps, TState> {
  constructor(props: CalculatorScreenProps) {
    super(props);

    // Uncomment to instantly move to the Chat
    // props.navigation.navigate('Chat');

    this.state = {
      display: 0,
      operation: '',
      shouldConcatenateDigit: false,
    };
  }

  concatenateDigit = (digit: string) => {
    if (this.state.shouldConcatenateDigit) {
      if (this.state.display.toString().replace(',', "").length >= 9) {

      } else if (this.state.display == "0" && digit == "0") {

      } else {
        this.setState((prevState) => ({
          display: Number(prevState.display.toString() + digit),
        }));
      }
    } else {
      this.setState({
        display: digit,
        shouldConcatenateDigit: true,
      });
    }
  };

  activateOperation = (operation: string) => {
    variableA = Number(this.state.display);
    this.setState({
      shouldConcatenateDigit: false,
      operation,
    });
  };

  generateResult = () => {
    const startChat = (res: string | number) => {
      if (Number(res) == 4000) {
        console.log('Start Chat!');
        this.props.navigation.navigate('Chat');
      }
    }

    switch (this.state.operation) {
      case 'division':
        variableB = Number(this.state.display);
        result = variableA / variableB;
        this.setState({
          display: +result.toFixed(5),
          operation: '',
        });
        break;
      case 'multiplication':
        variableB = Number(this.state.display);
        result = variableA * variableB;
        this.setState({
          display: +result.toFixed(5),
          operation: '',
        });
        break;
      case 'subtraction':
        variableB = Number(this.state.display);
        result = variableA - variableB;
        this.setState({
          display: +result.toFixed(5),
          // This tweak fixes erros like 0.3 - 0.2 !== 0.1
          operation: '',
        });
        // Start chat if res is 4000
        startChat(result);
        break;
      case 'addition':
        variableB = Number(this.state.display);
        result = variableA + variableB;
        this.setState({
          display: +result.toFixed(5),
          // This tweak fixes errors like 0.1 + 0.2 !== 0.3
          operation: '',
        });
        // Start calculator if res is 4000
        startChat(result);
        break;
      default:
        return null;
    }
  };

  cancelButton = () => {
    if (!this.state.shouldConcatenateDigit && this.state.display === 0) {
      this.setState({
        operation: '',
      });
    }
    this.setState({
      display: 0,
      shouldConcatenateDigit: false,
    });
  };

  addDot = () => {
    if (Math.round(Number(this.state.display)) === Number(this.state.display)) {
      this.setState((prevState) => ({
        display: `${prevState.display}.`,
        shouldConcatenateDigit: true,
      }));
    }
  };

  percentage = () => {
    this.setState((prevState) => ({
      display: Number(prevState.display) / 100,
    }));
  }

  invertSignal = () => {
    this.setState((prevState) => ({
      display: Number(prevState.display) * -1,
    }));
  }

  render() {
    return (
      <View style={styles.container}>
        <Display display={Number(this.state.display)}/>
        <View style={styles.row}>
          <Button
            backgroundColor="#A6A6A6"
            color="black"
            text={this.state.display ? 'C' : 'AC'}
            func={() => this.cancelButton()}
          />
          <Button
            backgroundColor="#A6A6A6"
            color="black"
            text="+/-"
            func={() => this.invertSignal()}
          />
          <Button
            backgroundColor="#A6A6A6"
            color="black"
            text="%"
            func={() => this.percentage()}
          />
          <Button
            orange
            backgroundColor={
              this.state.operation === 'division' ? 'white' : '#FF9404'
            }
            color={this.state.operation === 'division' ? '#FF9404' : 'white'}
            text="÷"
            func={() => this.activateOperation('division')}
          />
        </View>
        <View style={styles.row}>
          <Button
            backgroundColor="#333333"
            color="white"
            text="7"
            func={() => this.concatenateDigit("7")}
          />
          <Button
            backgroundColor="#333333"
            color="white"
            text="8"
            func={() => this.concatenateDigit("8")}
          />
          <Button
            backgroundColor="#333333"
            color="white"
            text="9"
            func={() => this.concatenateDigit("9")}
          />
          <Button
            orange
            backgroundColor={
              this.state.operation === 'multiplication' ? 'white' : '#FF9404'
            }
            color={this.state.operation === 'multiplication' ? '#FF9404' : 'white'}
            text="×"
            func={() => this.activateOperation('multiplication')}
          />
        </View>
        <View style={styles.row}>
          <Button
            backgroundColor="#333333"
            color="white"
            text="4"
            func={() => this.concatenateDigit("4")}
          />
          <Button
            backgroundColor="#333333"
            color="white"
            text="5"
            func={() => this.concatenateDigit("5")}
          />
          <Button
            backgroundColor="#333333"
            color="white"
            text="6"
            func={() => this.concatenateDigit("6")}
          />
          <Button
            orange
            backgroundColor={
              this.state.operation === 'subtraction' ? 'white' : '#FF9404'
            }
            color={this.state.operation === 'subtraction' ? '#FF9404' : 'white'}
            text='−'
            func={() => this.activateOperation('subtraction')}
          />
        </View>
        <View style={styles.row}>
          <Button
            backgroundColor="#333333"
            color="white"
            text="1"
            func={() => this.concatenateDigit("1")}
          />
          <Button
            backgroundColor="#333333"
            color="white"
            text="2"
            func={() => this.concatenateDigit("2")}
          />
          <Button
            backgroundColor="#333333"
            color="white"
            text="3"
            func={() => this.concatenateDigit("3")}
          />
          <Button
            orange
            backgroundColor={
              this.state.operation === 'addition' ? 'white' : '#FF9404'
            }
            color={this.state.operation === 'addition' ? '#FF9404' : 'white'}
            text='+'
            func={() => this.activateOperation('addition')}
          />
        </View>
        <View style={styles.row}>
          <Button
            special
            backgroundColor="#333333"
            color="white"
            text="0"
            func={() => this.concatenateDigit("0")}
          />
          <Button
            backgroundColor="#333333"
            color="white"
            text=","
            func={() => this.addDot()}
          />
          <Button
            orange
            backgroundColor="#FF9404"
            color="white"
            text="="
            func={() => this.generateResult()}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'black',
    padding: 8,
    paddingBottom: 70,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5,
    marginBottom: 7,
  },
  icon: {
    textAlign: 'center',
  },
});
