import React from "react";
import { createContext } from "react";

interface Props {
    children: React.ReactNode
}

export const UserProvider: React.FC<Props> = ({ children }) => {
    const [userContext, setPassword] = React.useState<string|null>(null)

    const savePassword = (password: string|null) => {
        setPassword(password)
    }

    return <UserContext.Provider value={{ userContext, savePassword}}>
        {children}
    </UserContext.Provider>
}

export type UserContextType = {
    userContext: string|null;
    savePassword: (password: string|null) => void;
}

export const UserContext = createContext<UserContextType|null>(null);

