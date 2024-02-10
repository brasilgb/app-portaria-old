import React, { useContext, useEffect, useState } from "react";
import AppLayout from "../../layouts/AppLayout";
import { View, Text, Alert } from "react-native";
import AppHeader from "../../layouts/Headers/AppHeader";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../RootStackParams";
import moment from "moment";
import serviceapp from "../../services/serviceportaria";
import { maskHour } from "../../utils/masks";
import DatePicker from '@react-native-community/datetimepicker';
import AppLoading from "../../components/AppLoading";
import { AuthContext } from "../../contexts/auth";

interface HomeProps {

}

const HistoricoVisitas = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { user } = useContext(AuthContext);
    const [visitasPendentes, setVisitasPendentes] = useState([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [bColor, setBColor] = useState(0);
    const [dateTop, setDateTop] = useState(new Date());
    const [showDateTop, setShowDateTop] = useState(false);

    useEffect(() => {
        setLoading(true);
        const getVisitasAbertas = (async () => {
            await serviceapp.post(`(PORT_LISTA_VISITA)`,
                {
                    status: 2,
                    data: moment(dateTop).format("YYYYMMDD"),
                    filial: user.filial
                }).then((response) => {
                    if (response.data.visita.success) {
                        setTimeout(() => {
                            setLoading(false);
                            setVisitasPendentes(response.data.visita.data);
                        }, 500);
                    } else {
                        setLoading(false);
                        return;
                    }
                });
        });
        getVisitasAbertas();
    }, [dateTop])

    const handleExitVisita = (async (vid: number) => {
        setBColor(vid);
        await serviceapp.post(`(PORT_ALTERA_VISITA)`, {
            status: 1,
            user: user.code,
            ident: vid,
            dsaida: '00010101',
            hsaida: 0
        }).then(async (response) => {
            if (response.data.visita.success) {
                Alert.alert(
                    'Atenção',
                    'Horário de saída revertido.',
                    [
                        {
                            text: "ok",
                            onPress: async () => {
                                setLoading(true);
                                await serviceapp.post(`(PORT_LISTA_VISITA)`,
                                    {
                                        status: 2,
                                        data: moment(dateTop).format("YYYYMMDD"),
                                        filial: user.filial
                                    }).then((response) => {
                                        setTimeout(() => {
                                            setLoading(false);
                                            setVisitasPendentes(response.data.visita.data);
                                        }, 500);
                                    });
                            }
                        }
                    ]
                );
            }
        }).catch((error) => {
            console.log(error);
        })
    });

    const onChangeDateTop = (event: any, selectedDateTop: any) => {
        const currentDateTop = selectedDateTop;
        setShowDateTop(false);
        setDateTop(currentDateTop);
    };


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
                {showDateTop && (
                    <DatePicker
                        value={dateTop}
                        mode="date"
                        is24Hour={true}
                        onChange={onChangeDateTop}
                    />
                )}
                <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                    <View className="bg-solar-orange-middle border border-white mx-2 mb-6 mt-2 rounded-lg py-4">
                        <View className="flex-col items-center justify-center py-2">
                            <Text className="text-lg uppercase text-solar-blue-dark font-Poppins_500Medium">Histórico de visitantes</Text>
                        </View>
                        <View className="flex-col items-center justify-center mx-20 pt-2 border-t border-t-solar-yellow-light">
                            <Text className="text-base text-gray-600 font-Poppins_500Medium">Filial {user.filial}</Text>
                        </View>
                    </View>
                    <View className="mx-2 mb-2 flex-row items-center justify-start">
                        <Ionicons name="calendar" color={"#f34b4b"} size={38} onPress={() => setShowDateTop(true)} />
                        <Text className="ml-2 text-lg font-semibold text-[#f34b4b]">{moment(dateTop).format("DD/MM/YYYY")}</Text>
                    </View>
                    <View className="mx-2 p-1 bg-white border-gray-300 rounded-md">
                        <View className="bg-solar-gray-dark flex-row items-center justify-between border-y border-x border-gray-300">
                            <Ionicons name="alert-circle" size={34} color="#F1F1F1" />
                            <Text className="flex-grow px-1 py-3 text-base font-Poppins_500Medium">Motorista</Text>
                            <Text className="w-24 border-x px-1 py-3 border-gray-300 text-base font-Poppins_500Medium">Placa</Text>
                            <Text className="w-[123px] px-1 py-3 text-base font-Poppins_500Medium">Data</Text>
                            <Text className="w-16 px-1 py-3 text-base font-Poppins_500Medium">Hora</Text>
                            <Ionicons name="checkmark-circle" size={32} color="#F1F1F1" />
                        </View>
                        {visitasPendentes?.map((mt: any, index: any) => (
                            <View key={mt.cpf + index} className={`${index % 2 ? 'bg-blue-50' : 'bg-red-50'} flex-row items-center justify-between border-b border-x border-gray-300`}>
                                <Ionicons name="alert-circle" size={34} color="#29ABE2"
                                    onPress={() => navigation.navigate('InfoVisitanteSaida', { data: { ident: mt.ident, nome: mt.nome } })}
                                />
                                <Text className="flex-grow px-1 py-3 text-base font-Poppins_400Regular">{mt.nome}</Text>
                                <Text className="w-24 border-x px-1 py-3 border-gray-300 text-base font-Poppins_400Regular">{mt.placa}</Text>
                                <View className="w-[120px] pl-1">
                                    <View className="flex-row items-center justify-start pt-1 pb-0.5">
                                        <MaterialCommunityIcons name="arrow-right-bold" size={18} color="#27a716" />
                                        <Text className="text-base font-Poppins_400Regular">{moment((mt.dataEntrada).toString()).format("DD/MM/YYYY")}</Text>
                                    </View>
                                    <View className="flex-row items-center justify-start pb-1 pt-0.5">
                                        <MaterialCommunityIcons name="arrow-left-bold" size={18} color="#e73e3e" />
                                        <Text className="text-base font-Poppins_400Regular">{moment((mt.dataSaida).toString()).format("DD/MM/YYYY")}</Text>
                                    </View>
                                </View>
                                <View className="w-16 pl-1">
                                    <Text className="pb-0.5 text-base font-Poppins_400Regular">{maskHour(("0000" + mt.horaEntrada).slice(-4))}</Text>
                                    <Text className="pt-0.5 text-base font-Poppins_400Regular">{maskHour(("0000" + mt.horaSaida).slice(-4))}</Text>
                                </View>

                                <Ionicons name="checkmark-circle" size={36} color={`${bColor === mt.ident ? '#27a716' : '#e73e3e'}`}
                                    onPress={() => handleExitVisita(mt.ident)} />
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </AppLayout>
        </>

    )
}

export default HistoricoVisitas;