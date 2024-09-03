import React from "react";
import Svg, { Rect } from "react-native-svg";

const CrossIcon = (props: any) => (
  <Svg width={props.width} height={props.height} fill="white" {...props}>
    <Rect
      x="10.7857"
      y="8"
      width="32.83"
      height="3.93959"
      rx="1.9698"
      transform="rotate(45 10.7857 8)"
      fill="#D9D9D9"
    />
    <Rect
      width="32.83"
      height="3.93959"
      rx="1.9698"
      transform="matrix(-0.707107 0.707107 0.707107 0.707107 31.2143 8)"
      fill="#D9D9D9"
    />
  </Svg>
);

export default CrossIcon;
