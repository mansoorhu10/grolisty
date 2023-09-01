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
    const [weightUnit, setWeightUnit] = useState('');
    const [error, setError] = useState(null);
    const [emptyFields, setEmptyFields] = useState([]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setError('You must be logged in');
            return;
        }
        
        const groceryItem = {title, brand, weight, weightUnit};

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
            setWeightUnit('');
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

                <label>Weight:</label>
                <div className="weight">
                    <input 
                        type="number"
                        onChange={(e) => setWeight(e.target.value)}
                        value={weight}
                        className={emptyFields.includes('weight') ? 'error' : ''}
                        min="0"
                    />
                    <select className="dropdown" defaultValue="g" onChange={(e) => setWeightUnit(e.target.value)}>
                        <option value="g">g</option>
                        <option value="kg">kg</option>
                        <option value="mL">mL</option>
                        <option value="L">L</option>
                    </select>
                </div>

                <button>Add Item <i className="material-icon"><AddIcon /></i></button>
                {error && <div className='error'>{error}</div>} 
                
            </form>
            <ReceiptInterface />
        </div>
    )
}

export default ItemForm;