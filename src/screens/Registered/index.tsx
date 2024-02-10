import React from "react";
import { View, Text, Platform, Image, TouchableOpacity } from "react-native";
import AppLayout from "../../layouts/AppLayout";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../RootStackParams";
import { shadowForm } from "../../styles";
import AppHeader from "../../layouts/Headers/AppHeader";

const Registered = ({ route }: any) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { data } = route.params;

    return (
        <AppLayout
            bgColor="bg-solar-blue-light"
            statusBarBG="#00AEEF"
            statusBarStyle="light"
        >
            <AppHeader
                auxClasses={`bg-solar-blue-light ${Platform.OS === 'ios' ? '' : 'pt-3'}`}
                // iconLeft={<Ionicons name="chevron-back-sharp" color={"#FAA335"} size={36} onPress={() => navigation.goBack()} />}
                // iconRight={<Ionicons name="close" color={"#FAA335"} size={36} onPress={() => navigation.pop()} />}
                logo={false}
            />
            <View className="flex-col items-center justify-center h-[30%]">
                <Ionicons name="md-checkmark-sharp" size={140} color="#9fe95a" />
            </View>
            <View className="flex-col items-center justify-center px-12">
            <Text className="mt-10 font-Poppins_300Light text-4xl text-center text-white">Visita cadastrada</Text>
            <Text className="mt-4 font-Poppins_300Light text-4xl text-center text-white">com sucesso!</Text>
            <Text className="mt-1 font-Poppins_300Light text-[14px] text-center text-solar-yellow-light">para</Text>
            <Text className="mt-1 font-Poppins_300Light text-[18px] text-center text-white">
                    {data}
            </Text>
                <TouchableOpacity
                    onPress={() => navigation.navigate("Home")}
                    style={shadowForm}
                    className="flex items-center justify-center bg-solar-orange-middle mt-6 py-4 px-12 rounded-full"
                >
                    <Text className="text-lg uppercase font-Poppins_500Medium text-solar-gray-light">Continuar</Text>
                </TouchableOpacity>
            </View>
        </AppLayout>
    )
}

export default Registered;