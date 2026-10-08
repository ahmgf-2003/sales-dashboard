import { createContext, useContext, useState, useEffect } from "react";
import supabase from "../apis/supabase-api";

const sessionContext = createContext();

const Auth = ({ children }) => {
    const [session, setSession] = useState(null);

    useEffect(() => {
        async function getInitialSession() {
            try {
                const { data, error } = await supabase.auth.getSession();

                if (error) {
                    throw new Error(error);
                }

                setSession(data);
            } catch (err) {
                console.error(err.message);
            }
        }

        getInitialSession();

        const { data } = supabase.auth.onAuthStateChange((_, session) => {
            setSession(session)
        })

        return data.subscription.unsubscribe();
    }, []);

    return (
        <sessionContext.Provider value={session}>
            {children}
        </sessionContext.Provider>
    );
};

export function useAuth() {
    return useContext(sessionContext);
}

export default Auth;
