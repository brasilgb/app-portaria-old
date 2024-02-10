import React, { createContext, useCallback, useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import servicelogin from "../services/servicelogin";

export const AuthContext = createContext<any>({} as any);

interface AuthProps {
    children: React.ReactNode;
}

interface SignInProps {
    code: string;
    nome: string;
    filial: string;
    password: string;
}

export default function AuthProvider({ children }: AuthProps) {

    const [user, setUser] = useState<any>();
    const [historyFilial, setHistoryFilial] = useState('');
    // Armazena usuário no storage
    useEffect(() => {
        async function loadStorage() {
            const storageUser = await AsyncStorage.getItem('Auth_user');
            const storageFilial = await AsyncStorage.getItem('Auth_filial');
            if (storageUser) {
                setUser(JSON.parse(storageUser));
            }
            if (storageFilial) {
                setHistoryFilial(JSON.parse(storageFilial));
            }
        }
        loadStorage();
    }, []);

    const signIn = useCallback(async ({ code, nome, filial, password }: SignInProps) => {
        const response = await servicelogin.post('(LOG_USU_VALIDATE_LOGIN)', {
            code: code,
            password: password
        });
        if (response.status !== 200) {
            throw new Error(
                'Erro ao conectar-se ao servidor. O serviço da aplicação parece estar parado.',
            );
        };
        const { success, message, detailMessage } = response.data.login;
        if (!success) {
            setUser(undefined);
            Alert.alert('Erro de Acesso ', message);
            throw new Error(`${message}\n\nDetalhes:\n${detailMessage}`);
        }
        const portariaAccess = await validateAccessLevel(code, 2888, 10);
        let udata = {
            filial: filial,
            code: code,
            nome: nome,
            levelPortaria: portariaAccess
        }
        storageUser(udata);
        setUser(udata);
        storageFilial(filial);
        setHistoryFilial(filial);
        await servicelogin.get('(LOG_USU_CLOSE_CONNECTION)');
    }, []);

    const validateUser = useCallback(async ({ alternative }: any) => {
        const response = await servicelogin.post('(LOG_USU_VALIDATE_USER)', {
            alternative,
        });
        if (response.status !== 200) {
            throw new Error(
                'Erro ao conectar-se ao servidor. O serviço da aplicação parece estar parado.',
            );
        }
        const { success, message, detailMessage, userName, userCode } = response.data.user;
        if (!success) {
            setUser(undefined)
            Alert.alert('Erro de Acesso', message);
            throw new Error(`${message}\n\nDetalhes:\n${detailMessage}`);
        }
        return {
            userName,
            userCode
        };
    }, []);

    const validateAccessLevel = useCallback(async (userCode: any, programCode: any, module: any) => {
        const response = await servicelogin.post('(LOG_USU_VALIDATE_ACCESS)', {
            userCode,
            programCode,
            module,
        });
        if (response.status !== 200) {
            throw new Error(
                'Erro ao conectar-se ao servidor. O serviço da aplicação parece estar parado.',
            );
        }
        const { success } = response.data.access;
        return success;
    }, []);

    async function storageUser(data: any) {
        await AsyncStorage.setItem('Auth_user', JSON.stringify(data));
    }

    async function storageFilial(data: any) {
        await AsyncStorage.setItem('Auth_filial', JSON.stringify(data));
    }

    async function signOut() {
        Alert.alert(
            'Atenção - Ação de Logout',
            'Você será desconectado, deseja continuar?',
            [
                { text: 'Sim', onPress: () => disconnect() },
                {
                    text: 'Não',
                    style: 'cancel',
                },
            ],
            { cancelable: false }

        );
    }

    async function disconnect() {
        await AsyncStorage.clear()
            .then(() => {
                setUser(undefined);
            })
    }

    return (
        <AuthContext.Provider value={{
            signed: !!user,
            user,
            historyFilial,
            validateUser,
            signIn,
            disconnect,
            signOut,
        }}>
            {children}
        </AuthContext.Provider>
    );

};
