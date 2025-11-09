import { BrowserRouter as Router , Routes , Route } from "react-router-dom";
import { useEffect , useState , createContext , useContext, type ReactNode } from "react";
import axios from 'axios';
import App from "./App";

import Signup from "./Signup";

const AuthContext = createContext(null);

type AuthProviderProps = {
    children : ReactNode;
}

export function AuthProvider({children}:AuthProviderProps){
    return(
        <AuthContext.Provider value={null}>{children}</AuthContext.Provider>
    )
}

// here useAuth is a custom hook , we are using it to export our context "AuthContext";
// then from any other component we can import the functions , states exported by the AuthProvider function with a very simple syntax const {login,user} = useAuth();

export function useAuth(){
    return useContext(AuthContext);
}

export default function Root(){
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<App/>}/>
                    <Route path="/signup" element={<Signup/>}/>
                </Routes>
            </Router>
        </AuthProvider>
    )
}
