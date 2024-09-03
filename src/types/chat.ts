import {I18nManager} from 'react-native';
import {NetworkQualityStatsSample} from 'webrtc-issue-detector';

export enum TMessageEnum {
  User = 'User',
  Internal = 'Intrenal',
}

export type TMessage = {
  type: TMessageEnum;
  uuid: string;
};

/**
 * A Type witch represent a user message that 2 users can see
 */
export type TUserMessage = {
  from: string;
  text: string;
} & TMessage;

/**
 * A Type witch represent a not user message for internall app usage
 */
export type TInternalMessage = {
  peerNickname: TMessageEnum;
} & TMessage;

export type Chat = {
  chat: TUserMessage[];
};

export type TNetworkScore = {
  outboundStatsSample?: NetworkQualityStatsSample | undefined;
  inboundStatsSample?: NetworkQualityStatsSample | undefined;
};

export type TAutoDeleteMode = {
  state: boolean;
  timeInMilliseconds: number;
};
