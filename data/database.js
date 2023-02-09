import * as SQLite from "expo-sqlite";
import User from "../models/User";

// const database = SQLite.openDatabase("test.db");

const database = SQLite.openDatabase("test.db");

// database.exec([{ sql: "PRAGMA foreign_keys = ON;", args: [] }], false, () => console.log("Foreign keys turned on"));

database.exec([{ sql: "PRAGMA foreign_keys = ON;", args: [] }], false, () => {
    console.log("database opened successfully");
});

export const getAllUsers = () => {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
                `SELECT * FROM users`,
                [],
                (_, result) => {
                    const users = [];
                    for (const dp of result.rows._array) {
                        users.unshift(new User(dp.id, dp.name));
                    }
                    resolve(users);
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });
    return promise;
};

export const addNewUser = (id, name) => {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
                `INSERT INTO users (id , name) VALUES (? , ?)`,
                [id, name],
                (_, result) => {
                    resolve(result);
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });
    return promise;
};
