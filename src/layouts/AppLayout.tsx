import React, { Fragment } from 'react'
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native";

interface VisitasProp {
    children: React.ReactNode;
    bgColor: string;
    statusBarStyle?: any;
    statusBarBG?: string;
};

const AppLayout = ({ children, bgColor, statusBarBG, statusBarStyle }: VisitasProp) => {
    return (
        <SafeAreaView className={`flex-1 ${bgColor}`}>
            <StatusBar style="light" backgroundColor="#29ABE2" />
            { children }
        </SafeAreaView>
    )
}

export default AppLayout;