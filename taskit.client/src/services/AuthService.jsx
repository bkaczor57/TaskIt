import axios from 'axios';

//Login Function
export const loginUser = async (email, password) => {
    try {
        const response = await axios.post("/api/Auth/login", {email,password});
        return response.data;
    }
    catch(error){
        throw new Error("Błąd logowania: Niepoprawne dane");
    }
};