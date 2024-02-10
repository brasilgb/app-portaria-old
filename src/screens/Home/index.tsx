import React, { useContext, useEffect, useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import { View, Text, TouchableOpacity, KeyboardAvoidingView, BackHandler } from "react-native";
import AppHeader from "../../layouts/Headers/AppHeader";
import { Feather, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { shadowForm } from "../../styles";
import FormInput from "../../components/FormInput";
import { Formik } from "formik";
import schema from "./schema";
import { cpf } from "cpf-cnpj-validator";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../RootStackParams";
import serviceapp from "../../services/serviceportaria";
import AppLoading from "../../components/AppLoading";
import { AuthContext } from "../../contexts/auth";

interface HomeProps {
    cpf: string;
    pedido: string;
}

const Home = () => {

    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [loading, setLoading] = useState<boolean>(false);
    const { user, signOut } = useContext(AuthContext);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
        return () => backHandler.remove();
    }, []);

    const onsubmit = (async (values: HomeProps, { resetForm }: any) => {
        setLoading(true);
        resetForm();
        await serviceapp.post('(PORT_VALIDA_VISITANTE)', {
            cpf: values.cpf
        })
            .then((response) => {
                let loadVisitante = response.data.visitante;
                setTimeout(() => {
                    setLoading(false);
                    navigation.navigate('RegisterVisitors', {
                        data: {
                            values: values,
                            visitante: loadVisitante.success ? loadVisitante.data.visitante : '',
                            transportadora: loadVisitante.success ? loadVisitante.data.transportadora : ''
                        }
                    });
                }, 500)
            })
            .catch((err) => {
                console.log(err);
            });
    });

    return (
        <>
            {loading && <AppLoading color={"#EC6608"} classnameSP="!bg-solar-gray-dark" />}

            <AppLayout bgColor={"bg-solar-gray-dark"}>

                <AppHeader
                    auxClasses="bg-solar-blue-light py-2"
                    iconLeft={<Feather name="user-check" size={32} color="#FFD100" />}
                    iconRight={<MaterialCommunityIcons name="logout" size={32} color="#FFD100" onPress={() => signOut()} />}
                    logo={false}
                    textLeft={`${user.nome}`}
                />
                <KeyboardAvoidingView behavior="height" keyboardVerticalOffset={-2}>
                    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                        <View className="bg-solar-orange-middle border border-white mx-2 mb-6 mt-2 rounded-lg py-4">
                            <View className="flex-col items-center justify-center pb-2">
                                <Text className="text-2xl uppercase text-solar-blue-dark font-Poppins_500Medium">Sistema de Gestão Integrada</Text>
                                <Text className="text-lg uppercase text-solar-blue-dark font-Poppins_500Medium">Controle de entrada e saída de visitantes</Text>
                            </View>
                            <View className="flex-col items-center justify-center mx-20 pt-2 border-t border-t-solar-yellow-light">
                                <Text className="text-base text-gray-600 font-Poppins_500Medium">Cadastro de visitantes filial {user.filial}</Text>
                            </View>
                        </View>
                        <View className="bg-solar-gray-dark flex-row items-center justify-between px-2">
                            <TouchableOpacity
                                className="bg-green-500 py-3 px-4 rounded-md flex-row items-center"
                                style={shadowForm}
                                onPress={() => navigation.navigate('HistoricoVisitas', { data: 'data' })}
                            >
                                <MaterialIcons name="timelapse" color="#FFF" size={22} />
                                <Text className="text-white text-base uppercase font-Poppins_500Medium ml-2">Histórico</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="bg-red-500 py-3 px-4 rounded-md flex-row items-center"
                                style={shadowForm}
                                onPress={() => navigation.navigate('SaidasPendentes', { data: 'data' })}
                            >
                                <MaterialCommunityIcons name="exit-run" color="#FFF" size={22} />
                                <Text className="text-white text-base uppercase font-Poppins_500Medium ml-2">Saídas pendentes</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="mx-6">
                            <Formik
                                enableReinitialize
                                validationSchema={schema}
                                initialValues={{
                                    cpf: ' ',
                                    pedido: ' '
                                }}
                                onSubmit={onsubmit}
                            >
                                {({ handleChange, handleSubmit, setFieldTouched, values, touched, errors, isValid }) => (

                                    <View className="mb-4">
                                        {/* <FormObserver /> */}
                                        <FormInput
                                            className="mt-6"
                                            title="CPF Motorista"
                                            onChangeText={handleChange('cpf')}
                                            onBlur={() => setFieldTouched('cpf')}
                                            value={cpf.format(values.cpf)}
                                            isValid={isValid}
                                            editable={true}
                                            errors={errors.cpf}
                                            touched={touched.cpf}
                                            autoCapitalize="none"
                                            keyboarType="numeric"
                                            maxLength={14}
                                        />
                                        <FormInput
                                            className="mt-6"
                                            title="N° Pedido"
                                            onChangeText={handleChange('pedido')}
                                            onBlur={() => setFieldTouched('pedido')}
                                            value={values.pedido}
                                            isValid={isValid}
                                            editable={true}
                                            errors={errors.pedido}
                                            touched={touched.pedido}
                                            autoCapitalize="none"
                                            keyboarType="numeric"
                                        />
                                        <TouchableOpacity
                                            style={shadowForm}
                                            className={`flex items-center justify-center ${!isValid ? "bg-solar-gray-dark" : "bg-solar-orange-middle"} mt-10 mx-14 py-4 rounded-full`}
                                            onPress={handleSubmit as any}
                                        >
                                            <Text className={`text-lg font-Poppins_500Medium ${!isValid ? "text-gray-300" : "text-solar-blue-dark"}`}>Continuar</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </Formik>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </AppLayout>
        </>
    )
}

export default Home;