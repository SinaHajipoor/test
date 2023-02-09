import { useCallback, useEffect, useState } from "react";
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import * as Asset from "expo-asset";
import { addNewUser, getAllUsers } from "./data/database";
import { FlatList, Text, View, StyleSheet, TextInput, Button } from "react-native";
import LoadingOverlay from "./components/UI/LoadingOverlay";
//------------------------------------------
const App = () => {
    //------------------------------------------
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState([]);
    const [newUser, setNewUser] = useState();
    //------------------------------------------
    useEffect(() => {
        const openDatabase = async () => {
            if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + "SQLite")).exists) {
                await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + "SQLite");
            }
            await FileSystem.downloadAsync(Asset.Asset.fromModule(require("./data/test.db")).uri, FileSystem.documentDirectory + "SQLite/test.db");
            return SQLite.openDatabase("test.db");
        };
        openDatabase();
    }, []);
    //------------------------------------------
    useEffect(() => {
        const getUsers = async () => {
            setIsLoading(true);
            const users = await getAllUsers();
            setIsLoading(false);
            setUsers(users);
        };
        getUsers();
    }, []);
    //------------------------------------------
    const renderItemHandler = (itemData) => {
        const item = itemData.item;

        return (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
                <Text>{item.name}</Text>
            </View>
        );
    };
    //------------------------------------------
    if (isLoading) {
        return <LoadingOverlay message="منتظر بمانید" />;
    }

    //------------------------------------------
    const inputChangeHandler = (enteredText) => {
        setNewUser(enteredText);
    };
    const addnameHandler = () => {
        setIsLoading(true);
        addNewUser(10, newUser);
        setIsLoading(false);
    };

    //------------------------------------------
    return (
        <View style={styles.root}>
            <FlatList style={{ width: "100%", height: 120 }} data={users} keyExtractor={(item) => item.id} renderItem={renderItemHandler} />
            <TextInput style={{ padding: 10, borderWidth: 1, height: 60, width: "70%" }} value={newUser} onChangeText={inputChangeHandler} />
            <Button title="add name" onPress={addnameHandler} />
        </View>
    );
};

export default App;

const styles = StyleSheet.create({
    root: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});
