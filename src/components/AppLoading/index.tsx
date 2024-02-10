import { View, Text, ActivityIndicator } from 'react-native'
import React from 'react'
import { shadowAll } from "../../styles";

interface Props {
  color?: string;
  classnameBG?: string;
  classnameSP?: string;
}

export default function AppLoading({ color, classnameBG, classnameSP}: Props) {
  return (
    <View className={`${classnameBG} left-0 right-0 bottom-0 top-0 items-center justify-center z-20 absolute`}>
      <ActivityIndicator
        size="large"
        color={color}
        className={`bg-solar-blue-dark p-4 rounded-lg opacity-90 border-2 border-white ${classnameSP}`}
        style={shadowAll}
      />
    </View>
  )
}