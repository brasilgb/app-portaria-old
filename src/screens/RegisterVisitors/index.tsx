import React, { useContext, useEffect, useState } from "react";
import { View, Text, KeyboardAvoidingView, TouchableOpacity, BackHandler } from "react-native";
import AppLayout from "../../layouts/AppLayout";
import { ScrollView } from "react-native-gesture-handler";
import { shadowForm } from "../../styles";
import FormInput from "../../components/FormInput";
import { Formik } from "formik";
import { Ionicons } from "@expo/vector-icons";
import AppHeader from "../../layouts/Headers/AppHeader";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../RootStackParams";
import serviceapp from "../../services/serviceportaria";
import AppLoading from "../../components/AppLoading";
import DateTimePicker from '@react-native-community/datetimepicker';
import { maskHour, unMask } from "../../utils/masks";
import moment from "moment";
import { AuthContext } from "../../contexts/auth";
import schema from "./schema";

interface RegisterProps {
    dataEntrada: any;
    fornecedor: string;
    transportadora: string;
    motorista: string;
    placa: string;
    nota: string;
    horaEntrada: string;
    horaSaida: string;
    quantidade: string;
    destino: string;
    produto: string;
    observacao: string;
}

const RegisterVisitors = ({ route }: any) => {
    const { data } = route.params;
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState<boolean>(false);
    const [fornecedor, setFornecedor] = useState('');
    const [date, setDate] = useState(new Date());
    const [hour, setHour] = useState(new Date());
    const [show, setShow] = useState(false);
    const [showTime, setShowTime] = useState(false);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
        return () => backHandler.remove();
    }, [])

    useEffect(() => {
        const getFornecedor = (async () => {
            await serviceapp.post(`(PORT_VALIDA_PEDIDO)`, {
                pedido: data.values.pedido
            })
                .then((response) => {
                    let loadFornecedor = response.data.pedido;
                    if (loadFornecedor.success) {
                        setLoading(true);
                        setTimeout(() => {
                            setFornecedor(loadFornecedor.data.fornecedor);
                            setLoading(false);
                        }, 500)
                        return;
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        });
        getFornecedor();
    }, [data]);

    const onChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate;
        setShow(false);
        setDate(currentDate);
    };

    const onChangeHour = (event: any, selectedHour: any) => {
        const currentHour = selectedHour;
        setShowTime(false);
        setHour(currentHour);
    };

    const onsubmit = (async (values: RegisterProps, { resetForm }: any) => {
        setLoading(true);
        let dataatual = ((values.dataEntrada).split('/'));
        let formdate = dataatual[2] + dataatual[1] + dataatual[0];
        await serviceapp.post(`(PORT_GRAVA_VISITA)`, {
            "user": user.code,
            "filial": user.filial,
            "cpf": data.values.cpf,
            "nome": values.motorista,
            "data": formdate,
            "fornecedor": values.fornecedor,
            "transportadora": values.transportadora,
            "placa": values.placa,
            "nota": values.nota,
            "pedido": data.values.pedido,
            "horaEntrada": unMask(values.horaEntrada),
            "quantidade": values.quantidade,
            "destino": values.destino,
            "produto": values.produto,
            "observacao": values.observacao
        }).then((response) => {
            if (response.data.visita.success) {
                setTimeout(() => {
                    setLoading(false);
                    navigation.navigate('Registered', { data: values.motorista });
                }, 500);
            }
        }).catch((error) => {
            console.log(error);
        });
        resetForm();
    });

    return (
        <>
            {loading && <AppLoading color={"#EC6608"} classnameSP="!bg-solar-gray-dark" />}
            <AppLayout bgColor={"bg-solar-gray-dark"}>

                <AppHeader
                    auxClasses="bg-solar-blue-light py-2"
                    iconLeft={<Ionicons name="chevron-back-sharp" color={"#FFD100"} size={36} onPress={() => navigation.goBack()} />}
                    // iconRight={<MaterialCommunityIcons name="logout" size={32} color="#FFD100" />}
                    logo={false}
                // textLeft="Nome porteiro"
                />
                <KeyboardAvoidingView
                    behavior={undefined}
                    keyboardVerticalOffset={0}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View className="bg-solar-orange-middle border border-white mx-2 mb-6 mt-2 rounded-lg py-4">
                            <View className="flex-col items-center justify-center py-2">
                                <Text className="text-lg uppercase text-solar-blue-dark font-Poppins_500Medium">Cadastro de visitantes - filial {user.filial}</Text>
                            </View>
                            <View className="flex-col items-center justify-center mx-0 pt-2 border-t border-t-solar-yellow-light">
                                <Text className="text-base text-gray-600 font-Poppins_500Medium">Preencha corretamente os campos abaixo </Text>
                            </View>
                        </View>

                        <View className="mx-6 pb-28">
                            <Formik
                                enableReinitialize
                                validationSchema={schema}
                                initialValues={{
                                    motorista: data.visitante,
                                    dataEntrada: moment().format("DD/MM/YYYY"),
                                    fornecedor: fornecedor,
                                    transportadora: data.transportadora,
                                    placa: '',
                                    nota: '',
                                    horaEntrada: moment(hour).format("HH:mm"),
                                    horaSaida: '',
                                    quantidade: '',
                                    destino: '',
                                    produto: '',
                                    observacao: ''
                                }}
                                onSubmit={onsubmit}
                            >
                                {({ handleChange, handleBlur, setValues, setFieldValue, handleSubmit, setFieldTouched, values, touched, errors, isValid }) => (

                                    <>
                                        {show && (
                                            <DateTimePicker
                                                value={date}
                                                mode="date"
                                                is24Hour={true}
                                                onChange={onChange}
                                            />
                                        )}
                                        {showTime && (
                                            <DateTimePicker
                                                value={hour}
                                                mode="time"
                                                is24Hour={true}
                                                onChange={onChangeHour}
                                                display="clock"
                                            />
                                        )}
                                        <FormInput
                                            className="mt-6"
                                            title="Data entrada"
                                            onChangeText={handleChange('dataEntrada')}
                                            onBlur={() => setFieldTouched('dataEntrada')}
                                            value={values.dataEntrada = moment(date).format("DD/MM/YYYY")}
                                            isValid={isValid}
                                            editable={false}
                                            errors={errors.dataEntrada}
                                            touched={touched.dataEntrada}
                                            autoCapitalize="none"
                                            maxLength={14}
                                            iconSecurity="calendar"
                                            actionSecurity={() => setShow(true)}
                                        />
                                        <FormInput
                                            className="mt-6"
                                            title="Horário entrada"
                                            onChangeText={handleChange('horaEntrada')}
                                            onBlur={() => setFieldTouched('horaEntrada')}
                                            value={values.horaEntrada = moment(hour).format("HH:mm")}
                                            isValid={isValid}
                                            editable={false}
                                            errors={errors.horaEntrada}
                                            touched={touched.horaEntrada}
                                            autoCapitalize="none"
                                            keyboarType="numeric"
                                            maxLength={5}
                                            iconSecurity="time"
                                            actionSecurity={() => setShowTime(true)}
                                        />
                                        <FormInput
                                            className="mt-6"
                                            title="Fornecedor/prestador de serviço"
                                            onChangeText={handleChange('fornecedor')}
                                            onBlur={() => setFieldTouched('fornecedor')}
                                            value={values.fornecedor}
                                            isValid={isValid}
                                            editable={true}
                                            errors={errors.fornecedor}
                                            touched={touched.fornecedor}
                                            autoCapitalize="characters"
                                        />
                                        <FormInput
                                            className="mt-6"
                                            title="Transportadora"
                                            onChangeText={handleChange('transportadora')}
                                            onBlur={() => setFieldTouched('transportadora')}
                                            value={values.transportadora}
                                            isValid={isValid}
                                            editable={true}
                                            errors={errors.transportadora}
                                            touched={touched.transportadora}
                                            autoCapitalize="characters"
                                        />
                                        <FormInput
                                            className="mt-6"
                                            title="Nome motorista"
                                            onChangeText={handleChange('motorista')}
                                            onBlur={() => setFieldTouched('motorista')}
                                            value={values.motorista}
                                            isValid={isValid}
                                            editable={true}
                                            errors={errors.motorista}
                                            touched={touched.motorista}
                                            autoCapitalize="characters"
                                        />
                                        <FormInput
                                            className="mt-6"
                                            title="Placa"
                                            onChangeText={handleChange('placa')}
                                            onBlur={() => setFieldTouched('placa')}
                                            value={values.placa}
                                            isValid={isValid}
                                            editable={true}
                                            errors={errors.placa}
                                            touched={touched.placa}
                                            autoCapitalize="characters"
                                            maxLength={7}
                                        />
                                        <FormInput
                                            className="mt-6"
                                            title="Nota fiscal"
                                            onChangeText={handleChange('nota')}
                                            onBlur={() => setFieldTouched('nota')}
                                            value={values.nota}
                                            isValid={isValid}
                                            editable={true}
                                            errors={errors.nota}
                                            touched={touched.nota}
                                            keyboarType="numeric"
                                            autoCapitalize="characters"
                                            maxLength={10}
                                        />
                                        <FormInput
                                            className="mt-6"
                                            title="Quantidade"
                                            onChangeText={handleChange('quantidade')}
                                            onBlur={() => setFieldTouched('quantidade')}
                                            value={values.quantidade}
                                            isValid={isValid}
                                            editable={true}
                                            errors={errors.quantidade}
                                            touched={touched.quantidade}
                                            keyboarType="numeric"
                                        />
                                        <FormInput
                                            className="mt-6"
                                            title="Destino"
                                            onChangeText={handleChange('destino')}
                                            onBlur={() => setFieldTouched('destino')}
                                            value={values.destino}
                                            isValid={isValid}
                                            editable={true}
                                            errors={errors.destino}
                                            touched={touched.destino}
                                            autoCapitalize="characters"
                                        />
                                        <FormInput
                                            className="mt-6"
                                            title="Tipo de produto/serviço"
                                            onChangeText={handleChange('produto')}
                                            onBlur={() => setFieldTouched('produto')}
                                            value={values.produto}
                                            isValid={isValid}
                                            editable={true}
                                            errors={errors.produto}
                                            touched={touched.produto}
                                            autoCapitalize="characters"
                                        />
                                        <FormInput
                                            className="mt-6"
                                            title="Observações"
                                            onChangeText={handleChange('observacao')}
                                            onBlur={() => setFieldTouched('observacao')}
                                            value={values.observacao}
                                            isValid={isValid}
                                            editable={true}
                                            errors={errors.observacao}
                                            touched={touched.observacao}
                                            // autoCapitalize="characters"
                                            multiline={true}
                                            numberOfLines={3}
                                        />

                                        <TouchableOpacity
                                            style={shadowForm}
                                            className={`flex items-center justify-center ${!isValid ? "bg-solar-gray-dark" : "bg-solar-orange-middle"} mt-10 mx-14 py-4 rounded-full`}
                                            onPress={handleSubmit as any}
                                        >
                                            <Text className={`text-lg font-Poppins_500Medium ${!isValid ? "text-gray-300" : "text-solar-blue-dark"}`}>Próximo</Text>
                                        </TouchableOpacity>

                                    </>
                                )}
                            </Formik>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView >

            </AppLayout >
        </>
    )
}

export default RegisterVisitors;