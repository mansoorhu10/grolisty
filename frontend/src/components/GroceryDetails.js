import { useGroceriesContext } from '../hooks/useGroceriesContext'
import { useAuthContext } from '../hooks/useAuthContext';

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

// mui-icons
import DeleteIcon from '@mui/icons-material/Delete';

const GroceryDetails = ({ groceryItem }) => {
    const { dispatch } = useGroceriesContext();
    const { user } = useAuthContext();

    const handleClick = async () => {
        if (!user) {
            return;
        }

        const response = await fetch('/api/groceries/' + groceryItem._id, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });

        const json = await response.json();

        if(response.ok){
            dispatch({type: 'DELETE_GROCERY_ITEM', payload: json})
        }
    }

    return (
        <div className="grocery-details">
            <h4>{groceryItem.title}</h4>
            <p><strong>Brand: </strong>{groceryItem.brand}</p>
            <p><strong>Weight: </strong>{groceryItem.weight} {groceryItem.weightUnit}</p>
            <p>{formatDistanceToNow(new Date(groceryItem.createdAt), { addSuffix: true })}</p>
            <span onClick={handleClick} className="material-icon"><DeleteIcon /></span>
        </div>
    )
}

export default GroceryDetails;