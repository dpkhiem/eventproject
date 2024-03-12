import {getQueryParam} from "../Utils/StringUtil";

export type StorageAuth = {
    isAuth: boolean,
    token: string,
    me: {
        name: String,
        phone: String
    }
}
export default class Storage {
    private readonly auth: StorageAuth;
    private static i: Storage = null;

    constructor() {
        this.auth = {
            isAuth: false,
            token: "",
            me: {
                name: null,
                phone: null
            }
        }
    }

    getAuth(): StorageAuth {
        return this.auth;
    }

    static I() {
        if (Storage.i === null) {
            Storage.i = new Storage();
        }

        return Storage.i;
    }

    authenticated(name: string, phone: string) {
        this.auth.isAuth = true;
        this.auth.token = getQueryParam("token");
        this.auth.me.name = name;
        this.auth.me.phone = phone;
    }

    unAuthenticated() {
        this.auth.isAuth = false;
        this.auth.token = null;
        this.auth.me.name = null;
        this.auth.me.phone = null;
    }
}