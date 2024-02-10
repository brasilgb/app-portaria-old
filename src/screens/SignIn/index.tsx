import React, { useContext, useState } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, Pressable, Modal, Dimensions } from "react-native";
import AppLayout from "../../layouts/AppLayout";
import AppLoading from "../../components/AppLoading";
import { shadowAll, shadowForm } from "../../styles";
import FormInput from "../../components/FormInput";
import { Formik } from "formik";
import { MaterialIcons } from "@expo/vector-icons";
import schema from "./schema";
import { AuthContext } from "../../contexts/auth";
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

interface SignInProps {
    code: string;
    filial: string;
    password: string;
}

const SignIn = () => {
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const { signIn, validateUser, historyFilial } = useContext(AuthContext);
    const [selectedPortaria, setSelectedPortaria] = useState(historyFilial);
    const [showPassword, setShowPassword] = useState(false);

    const handlePortaria = (option: any) => {
        setModalVisible(false);
        setSelectedPortaria(option);
    }

    const onsubmit = (async (values: SignInProps, { resetForm }: any) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 500);
        resetForm({});
        const resp = await validateUser({ alternative: `${values.code}` });
        await signIn({ code: resp.userCode, nome: resp.userName, filial: values.filial, password: values.password });
    });

    return (
        <>
            {loading && <AppLoading color={"#EC6608"} classnameSP="!bg-solar-gray-dark" />}

            <Modal
                // statusBarTranslucent
                animationType="fade"
                transparent={true}
                visible={modalVisible}
            >
                <View className="flex-1 items-center justify-center bg-[#11204b73]">
                    <View
                        style={shadowAll}
                        className="m-5 py-[5px] bg-gray-200 rounded-md border-2 border-white z-10"
                    >
                        <View className="pb-2" style={{ width: WIDTH - 200, height: HEIGHT / 4 }}>
                            <TouchableOpacity
                                onPress={() => handlePortaria('')}
                            >
                                <View className="flex-row items-center justify-between border-b border-b-gray-300">
                                    <Text className="py-2 px-4 text-lg text-solar-blue-dark font-Poppins_500Medium">Selecione a portaria</Text>
                                    <MaterialIcons name="close" size={30} color="#FAA335" />
                                </View>
                            </TouchableOpacity>
                            <View className="flex-col items-start justify-start py-4 w-full">
                                <TouchableOpacity
                                    onPress={() => handlePortaria('1')}
                                    className="w-full"
                                >
                                    <Text className="py-2 px-4 text-base text-gray-600 font-Poppins_500Medium">   1 - Portaria Matriz</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => handlePortaria('26')}
                                    className="w-full"
                                >
                                    <Text className="py-2 px-4 text-base text-gray-600 font-Poppins_500Medium">26 - Portaria Naturovos</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </View>
            </Modal>

            <AppLayout bgColor="bg-solar-blue-light">
                <View className="flex-1 items-center justify-center">
                    <View className="py-8">
                        <Image source={require('../../../assets/logo-solar.png')} className="w-[320px] h-[116px]" />
                    </View>
                    <Formik
                        validationSchema={schema}
                        initialValues={{
                            code: '',
                            password: '',
                            filial: ''
                        }}
                        onSubmit={onsubmit}
                    >
                        {({ handleChange, handleSubmit, setFieldTouched, values, touched, errors, isValid }) => (
                            <View className="bg-gray-200 px-8 pt-10 w-10/12 rounded-2xl" style={shadowAll}>
                                <Pressable
                                    onPress={() => setModalVisible(!modalVisible)}
                                >
                                    <View pointerEvents="none" className="relative mb-8 flex-row items-center justify-between">
                                        <Text className="z-10 flex-1 pt-2 pb-1 px-8 rounded-l-lg text-lg font-Poppins_400Regular bg-white  border-y border-l border-gray-300 placeholder:text-slate-400 text-solar-blue-dark">Selecione a filial</Text>
                                        <TextInput
                                            className={`z-0 py-4 px-4 w-20 text-center -ml-[8px] rounded-full text-2xl font-bold bg-white border border-gray-300 placeholder:text-slate-400 text-solar-yellow-dark`}
                                            onChangeText={handleChange('filial')}
                                            onBlur={() => setFieldTouched('filial')}
                                            value={values.filial = selectedPortaria}
                                        />
                                    </View>
                                </Pressable>
                                <FormInput
                                    title="Usuário"
                                    onChangeText={handleChange('code')}
                                    onBlur={() => setFieldTouched('code')}
                                    value={values.code}
                                    isValid={isValid}
                                    editable={selectedPortaria ? true : false}
                                    errors={errors.code}
                                    touched={touched.code}
                                    autoCapitalize="none"
                                />
                                <FormInput
                                    className="mt-6"
                                    title="Senha"
                                    onChangeText={handleChange('password')}
                                    onBlur={() => setFieldTouched('password')}
                                    value={values.password}
                                    isValid={isValid}
                                    editable={selectedPortaria ? true : false}
                                    errors={errors.password}
                                    touched={touched.password}
                                    autoCapitalize="none"
                                    secureTextEntry={showPassword ? false : true}
                                    iconSecurity={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                    actionSecurity={() => setShowPassword(!showPassword)}
                                />
                                <TouchableOpacity
                                    style={shadowForm}
                                    className={`flex items-center justify-center ${!isValid || !selectedPortaria ? "bg-solar-gray-dark" : "bg-solar-orange-middle"} mt-10 mx-14 py-4 rounded-full`}
                                    onPress={handleSubmit as any}
                                    disabled={selectedPortaria ? false : true}
                                >
                                    <Text className={`text-lg font-Poppins_500Medium ${!isValid || !selectedPortaria ? "text-gray-300" : "text-solar-blue-dark"}`}>Acessar</Text>
                                </TouchableOpacity>
                                <View className="items-center my-6">
                                    <Text className="text-sm text-gray-400 font-Poppins_500Medium">Grupo Solar - App Portaria v 1.0.1</Text>
                                </View>

                            </View>
                        )}

                    </Formik>
                </View>
            </AppLayout>
        </>
    )
}

export default SignIn;