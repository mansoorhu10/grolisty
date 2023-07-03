import { useAuthContext } from "./useAuthContext";
import { useGroceriesContext } from "./useGroceriesContext";

export const useLogout = () => {
    const { dispatch } = useAuthContext();
    const { dispatch: groceriesDispatch } = useGroceriesContext();

    const logout = () => {
        // Remove user from storage
        localStorage.removeItem('user');

        // Dispatch logout action
        dispatch({type: 'LOGOUT'});
        groceriesDispatch({type: 'SET_GROCERIES', payload: null});
    }

    return { logout };
};