import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator, CardStyleInterpolators, StackHeaderProps, TransitionSpecs, HeaderStyleInterpolators } from '@react-navigation/stack';
import { RootStackParamList } from "../screens/RootStackParams";
import { HistoricoVisitas, Home, InfoVisitanteEntrada, InfoVisitanteSaida, RegisterVisitors, Registered, SaidasPendentes, SignIn } from "../screens";
const Stack = createStackNavigator<RootStackParamList>();

// interface NavigationProps {
//     header?: ((props: StackHeaderProps) => React.ReactNode) | undefined;
// }

const AppRoutes = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        presentation: 'transparentModal',
        animationEnabled: true,
        cardShadowEnabled: true, transitionSpec: {
          open: TransitionSpecs.TransitionIOSSpec,
          close: TransitionSpecs.TransitionIOSSpec,
        },
        headerStyleInterpolator: HeaderStyleInterpolators.forSlideLeft,
      }}>

      <Stack.Screen name="Home" component={Home} options={{ gestureEnabled: false, cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter }} />
      <Stack.Screen name="RegisterVisitors" component={RegisterVisitors} options={{ gestureEnabled: false }} />
      <Stack.Screen name="Registered" component={Registered} options={{ gestureEnabled: false }} />
      <Stack.Screen name="SaidasPendentes" component={SaidasPendentes} options={{ gestureEnabled: false }} />
      <Stack.Screen name="HistoricoVisitas" component={HistoricoVisitas} options={{ gestureEnabled: false }} />
      <Stack.Screen name="InfoVisitanteEntrada" component={InfoVisitanteEntrada} options={{ gestureEnabled: false, cardStyleInterpolator: CardStyleInterpolators.forBottomSheetAndroid }} />
      <Stack.Screen name="InfoVisitanteSaida" component={InfoVisitanteSaida} options={{ gestureEnabled: false, cardStyleInterpolator: CardStyleInterpolators.forBottomSheetAndroid }} />

    </Stack.Navigator>
  )
}

export default AppRoutes;