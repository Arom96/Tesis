export interface Roles {
    admin?: boolean;
    profesor?: boolean;
    estudiante?: boolean;
    dev?: boolean;
}

export interface UserInterface {
    id?: string;
    name?: string;
    lastname?: string;
    birthdate?: string;
    email?: string;
    photoUrl?: string;
    isLogged?: boolean;
    notification?: boolean;
    uid?: string;
    role?: string;
    tlf?: string;
    usrUrl?: string;
    enabled?: Array<string>;
    status?: Array<any>;
}