import React, { useEffect, useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import { View, Text } from "react-native";
import AppHeader from "../../layouts/Headers/AppHeader";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../RootStackParams";
import serviceapp from "../../services/serviceportaria";
import moment from "moment";
import { maskHour } from "../../utils/masks";
import { cpf } from "cpf-cnpj-validator";
import AppLoading from "../../components/AppLoading";
import serviceportaria from "../../services/serviceportaria";

interface VisitasProps {
    userIn: number;
    filial: number;
    fornecedor: string;
    transportadora: string;
    cpf: number;
    nome: string;
    placa: string;
    nota: number;
    pedido: number;
    horaEntrada: number;
    horaSaida: number;
    dataEntrada: number;
    dataSaida: number;
    quantidade: number;
    destino: string;
    produto: string;
    observacao: string;
}

const InfoVisitanteEntrada = ({ route }: any) => {

    const { data } = route?.params;
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const [visitasInfo, setVisitasInfo] = useState<VisitasProps>({} as VisitasProps);
    const [codeToNameIn, setCodeToNameIn] = useState();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getVisitasAbertas = (async () => {
            setLoading(true);
            await serviceapp.post(`(PORT_LISTA_VISITA_ID)`,
                {
                    ident: data.ident
                }).then((response) => {
                    setTimeout(() => {
                        setLoading(false);
                    }, 500);
                    setVisitasInfo(response.data.visita.data);
                })
        });
        getVisitasAbertas();
    }, [data])

    useEffect(() => {
        const getCodeToName = (async () => {
            await serviceportaria.post(`(LOG_USU_VALIDATE_USER)`,
                {
                    alternative: visitasInfo.userIn
                }).then((response) => {
                    setCodeToNameIn(response.data.user.userName);
                })
        });
        getCodeToName();
    }, [visitasInfo])

    return (
        <>
            {loading && <AppLoading color={"#EC6608"} classnameSP="!bg-solar-gray-dark" />}
            <AppLayout bgColor={"bg-solar-gray-dark"}>

                <AppHeader
                    auxClasses="bg-solar-blue-light py-2"
                    iconLeft={<Ionicons name="chevron-back-sharp" color={"#FFD100"} size={36} onPress={() => navigation.goBack()} />}
                    iconRight={<Ionicons name="home-outline" size={32} color="#FFD100" onPress={() => navigation.popToTop()} />}
                    logo={false}
                // textLeft="Nome porteiro"
                />

                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                    <View className="bg-solar-orange-middle border border-white mx-2 mb-6 mt-2 rounded-lg py-4">
                        <View className="flex-col items-center justify-center py-2">
                            <Text className="text-lg uppercase text-solar-blue-dark font-Poppins_500Medium">Informações de visitas</Text>
                        </View>
                        <View className="flex-row items-center justify-start pt-2 border-t border-t-solar-yellow-light">
                            <Text className="w-32 text-base text-gray-600 font-Poppins_500Medium pl-2">Filial: {visitasInfo.filial}</Text>
                            <Text className="flex-1 text-base text-gray-600 font-Poppins_500Medium border-l border-solar-yellow-light pl-2">Portaria: {codeToNameIn}</Text>
                        </View>
                    </View>

                    <View className="mx-2 bg-white border border-gray-300 rounded-lg">

                        <View className={`flex-row items-center justify-between border-b border-gray-300`}>
                            <Text className="flex-1 px-1 py-3 text-base font-Poppins_400Regular">Visitante</Text>
                            <Text className="flex-1 border-l px-1 py-3 border-gray-300 text-base font-Poppins_400Regular">{visitasInfo.nome}</Text>
                        </View>
                        <View className={`flex-row items-center justify-between border-b border-gray-300`}>
                            <Text className="flex-1 px-1 py-3 text-base font-Poppins_400Regular">CPF</Text>
                            <Text className="flex-1 border-l px-1 py-3 border-gray-300 text-base font-Poppins_400Regular">{cpf.format(`${("00000000000" + visitasInfo.cpf).slice(-11)}`)}</Text>
                        </View>
                        <View className={`flex-row items-center justify-between border-b border-gray-300`}>
                            <Text className="flex-1 px-1 py-3 text-base font-Poppins_400Regular">Placa</Text>
                            <Text className="flex-1 border-l px-1 py-3 border-gray-300 text-base font-Poppins_400Regular">{visitasInfo.placa}</Text>
                        </View>
                        <View className={`flex-row items-center justify-between border-b border-gray-300`}>
                            <Text className="flex-1 px-1 py-3 text-base font-Poppins_400Regular">Fornecedor/Prest. serv.</Text>
                            <Text className="flex-1 border-l px-1 py-3 border-gray-300 text-base font-Poppins_400Regular">{visitasInfo.fornecedor}</Text>
                        </View>
                        <View className={`flex-row items-center justify-between border-b border-gray-300`}>
                            <Text className="flex-1 px-1 py-3 text-base font-Poppins_400Regular">Transportadora</Text>
                            <Text className="flex-1 border-l px-1 py-3 border-gray-300 text-base font-Poppins_400Regular">{visitasInfo.transportadora}</Text>
                        </View>
                        <View className={`flex-row items-center justify-between border-b border-gray-300`}>
                            <Text className="flex-1 px-1 py-3 text-base font-Poppins_400Regular">Nota</Text>
                            <Text className="flex-1 border-l px-1 py-3 border-gray-300 text-base font-Poppins_400Regular">{visitasInfo.nota}</Text>
                        </View>
                        <View className={`flex-row items-center justify-between border-b border-gray-300`}>
                            <Text className="flex-1 px-1 py-3 text-base font-Poppins_400Regular">Pedido</Text>
                            <Text className="flex-1 border-l px-1 py-3 border-gray-300 text-base font-Poppins_400Regular">{visitasInfo.pedido}</Text>
                        </View>
                        <View className={`flex-row items-center justify-between border-b border-gray-300`}>
                            <Text className="flex-1 px-1 py-3 text-base font-Poppins_400Regular">Data entrada</Text>
                            <Text className="flex-1 border-l px-1 py-3 border-gray-300 text-base font-Poppins_400Regular">{moment(`${visitasInfo.dataEntrada}`).format("DD/MM/YYYY")}</Text>
                        </View>
                        <View className={`flex-row items-center justify-between border-b border-gray-300`}>
                            <Text className="flex-1 px-1 py-3 text-base font-Poppins_400Regular">Hora entrada</Text>
                            <Text className="flex-1 border-l px-1 py-3 border-gray-300 text-base font-Poppins_400Regular">{maskHour(("0000" + visitasInfo.horaEntrada).slice(-4))}</Text>
                        </View>
                        <View className={`flex-row items-center justify-between border-b border-gray-300`}>
                            <Text className="flex-1 px-1 py-3 text-base font-Poppins_400Regular">Quantidade</Text>
                            <Text className="flex-1 border-l px-1 py-3 border-gray-300 text-base font-Poppins_400Regular">{visitasInfo.quantidade}</Text>
                        </View>
                        <View className={`flex-row items-center justify-between border-b border-gray-300`}>
                            <Text className="flex-1 px-1 py-3 text-base font-Poppins_400Regular">Destino</Text>
                            <Text className="flex-1 border-l px-1 py-3 border-gray-300 text-base font-Poppins_400Regular">{visitasInfo.destino}</Text>
                        </View>
                        <View className={`flex-row items-center justify-between border-b border-gray-300`}>
                            <Text className="flex-1 px-1 py-3 text-base font-Poppins_400Regular">Produto/Serviço</Text>
                            <Text className="flex-1 border-l px-1 py-3 border-gray-300 text-base font-Poppins_400Regular">{visitasInfo.produto}</Text>
                        </View>
                        <View className={`flex-row items-center justify-between border-gray-300`}>
                            <Text className="flex-1 px-1 py-3 text-base font-Poppins_400Regular">Observações</Text>
                            <Text className="flex-1 border-l px-1 py-3 border-gray-300 text-base font-Poppins_400Regular">{visitasInfo.observacao}</Text>
                        </View>

                    </View>
                </ScrollView>
            </AppLayout>
        </>
    )
}

export default InfoVisitanteEntrada;