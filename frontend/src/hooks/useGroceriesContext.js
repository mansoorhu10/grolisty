import { GroceriesContext } from "../context/GroceryContext";
import { useContext } from "react";

export const useGroceriesContext = () => {
    const context = useContext(GroceriesContext);

    if (!context){
        throw Error('useGroceriesContext must be used inside a GroceriesContextProvider');
    }

    return context;
}