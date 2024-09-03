import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";

interface RelativeTimeProps {
  date: Date;
}

const getRelativeTime = (date: Date) => {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
  return `${Math.floor(diff / 86400)} days ago`;
};

const RelativeTime: React.FC<RelativeTimeProps> = ({ date }) => {
  return <Text style={tw`text-gray-400`}>{getRelativeTime(date)}</Text>;
};

export default RelativeTime;
