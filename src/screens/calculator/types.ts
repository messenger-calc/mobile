import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../common/types';

export type ButtonProps = {
  backgroundColor: string;
  color: string;
  text: string;
  func: () => void;
  orange?: boolean;
  special?: boolean;
};

export type DisplayProps = {
  display: number;
};

export type TState = {
  display: number | string;
  operation: string;
  shouldConcatenateDigit: boolean;
};

export type CalculatorScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Calculator'
>;
