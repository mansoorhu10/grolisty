import { useState } from 'react';
import { useGroceriesContext } from '../hooks/useGroceriesContext';
import { useAuthContext } from '../hooks/useAuthContext';
import AddIcon from '@mui/icons-material/Add';
import ReceiptInterface from './ReceiptInterface';

const ItemForm = () => {
    const { dispatch } = useGroceriesContext();
    const { user } = useAuthContext();

    const [title, setTitle] = useState('');
    const [brand, setBrand] = useState('');
    const [weight, setWeight] = useState('');
    const [error, setError] = useState(null);
    const [emptyFields, setEmptyFields] = useState([]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setError('You must be logged in');
            return;
        }
        
        const groceryItem = {title, brand, weight};

        const response = await fetch('/api/groceries', {
            method: 'POST',
            body: JSON.stringify(groceryItem),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        });

        const json = await response.json();
        
        if (!response.ok) {
            setError(json.error);
            setEmptyFields(json.emptyFields);
            console.log(json.emptyFields);
        } 
        if (response.ok) {
            setTitle('');
            setBrand('');
            setWeight('');
            setError(null);
            setEmptyFields([]);
            console.log('New Grocery Item Added:', json);
            dispatch({type: 'CREATE_GROCERY_ITEM', payload: json});
        }
    }

    return (
        <div>
            <form className="create" onSubmit={handleSubmit}>
                <h3>Add a New Item</h3>

                <label>Name:</label>
                <input 
                    type="text"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    className={emptyFields.includes('title') ? 'error' : ''}
                />

                <label>Brand:</label>
                <input 
                    type="text"
                    onChange={(e) => setBrand(e.target.value)}
                    value={brand}
                    className={emptyFields.includes('brand') ? 'error' : ''}
                />

                <label>Weight (in g):</label>
                <input 
                    type="number"
                    onChange={(e) => setWeight(e.target.value)}
                    value={weight}
                    className={emptyFields.includes('weight') ? 'error' : ''}
                />

                <button>Add Item <AddIcon /></button>
                {error && <div className='error'>{error}</div>} 
                
            </form>
            <ReceiptInterface />
        </div>
    )
}

export default ItemForm;