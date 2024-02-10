import React from "react";
import { View, Text } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { SignIn } from "../screens";
const AuthStack = createStackNavigator();

type Props = {}

const AuthRoutes = (props: Props) => {
  return (
    <AuthStack.Navigator>
        <AuthStack.Screen
        name="SignIn"
        component={SignIn}
        options={{ headerShown: false }}
        />
    </AuthStack.Navigator>
  )
}

export default AuthRoutes;