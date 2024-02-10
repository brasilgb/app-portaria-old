import React from "react";
import { View, Text, Image } from "react-native";
import { StatusBar } from "react-native";

interface HeaderProps {
    auxClasses?: string;
    iconLeft?: any;
    iconRight?: any;
    logo: boolean;
    HEIGHT_STATUSBAR?: string;
    textLeft?: string;
}

const AppHeader = ({ auxClasses, iconLeft, iconRight, logo, textLeft }: HeaderProps) => {
const HEIGHT_STATUSBAR = StatusBar.currentHeight;    
    return (
        <View className={`${auxClasses} flex-row items-center justify-between w-full px-4`} style={{ marginTop: HEIGHT_STATUSBAR }}>
            <View className="flex-row items-center justify-start py-1">
                {iconLeft}
                <Text className="pl-2 text-lg font-Poppins_500Medium text-solar-gray-light">
                    {textLeft}
                </Text>
            </View>
            <View>
                {logo &&
                    <View className="p-0.5 bg-white rounded-tl-xl rounded-br-lg">
                        <Image source={require("../../../assets/logo-solar.png")} className="h-10 w-28" />
                    </View>
                }
            </View>
            <View className="py-1">
                {iconRight}
            </View>
        </View>
    )
}

export default AppHeader;