import React, { Fragment } from "react";
import { Text, TextInput, View } from "react-native";
import { shadowForm } from "../../styles";
import { Ionicons } from "@expo/vector-icons";

interface FormProps {
    className?: String;
    onChangeText?: any;
    onBlur?: any;
    autoCapitalize?: any;
    title?: any;
    keyboarType?: any;
    maxLength?: number;
    value?: any;
    isValid?: any;
    editable?: any;
    errors?: any;
    touched?: any;
    onTouchStart?: any;
    showSoftInputOnFocus?: any;
    placeholder?: any;
    cursor?: any;
    secureTextEntry?: any;
    iconSecurity?: any;
    actionSecurity?: any;
    multiline?: any;
    numberOfLines?: any;
}

const FormInput = ({ className, cursor, onChangeText, onBlur, autoCapitalize, keyboarType, maxLength, value, title, isValid, editable, touched, errors, onTouchStart, showSoftInputOnFocus, placeholder, secureTextEntry, iconSecurity, actionSecurity, multiline, numberOfLines }: FormProps) => {

    return (
        <Fragment>
            <View className={`${className}`} >
                <Text className="text-base relative pl-8 text-gray-400 font-Poppins_700Bold">{title}</Text>
                <TextInput
                    style={shadowForm}
                    className={`py-4 px-8 rounded-full text-lg font-Poppins_400Regular bg-white  border placeholder:text-slate-400 ${touched && errors ? "text-red-600 border-red-600" : "text-solar-blue-dark border-transparent"}`}
                    onChangeText={onChangeText}
                    onBlur={onBlur}
                    autoCapitalize={autoCapitalize}
                    autoCorrect={false}
                    keyboardType={keyboarType}
                    maxLength={maxLength}
                    value={value}
                    editable={editable}
                    showSoftInputOnFocus={showSoftInputOnFocus}
                    placeholder={placeholder}
                    placeholderTextColor="#154295"
                    cursorColor={cursor}
                    secureTextEntry={secureTextEntry}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                />
                <View className="absolute right-3 bottom-4">
                    <Ionicons name={iconSecurity} color={"#154295"} size={26} onPress={actionSecurity} />
                </View>
            </View>

            {touched && errors &&
                <Text className="self-end pr-6 pt-1 text-xs text-red-600 font-Poppins_400Regular_Italic">{errors}</Text>
            }
        </Fragment>
    )
}

export default FormInput;