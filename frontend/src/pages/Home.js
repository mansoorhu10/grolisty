import { useEffect } from 'react';
import { useGroceriesContext } from '../hooks/useGroceriesContext';

// components
import GroceryDetails from '../components/GroceryDetails';
import ItemForm from '../components/ItemForm';

const Home = () => {
    const { groceries, dispatch } = useGroceriesContext();

    useEffect(() => {
        const fetchGroceries = async () => {
            const response = await fetch('/api/groceries');
            const json = await response.json();

            if(response.ok) {
                dispatch({type:'SET_GROCERIES', payload: json});
            }
        }

        fetchGroceries();
    }, [dispatch]);

    return (
        <div className="home">
            <div className='groceries'>
                {groceries && groceries.map((groceryItem) => (
                    <GroceryDetails key={groceryItem._id} groceryItem={groceryItem} />
                ))}
            </div>
            <ItemForm />
        </div>
    )
}

export default Home;