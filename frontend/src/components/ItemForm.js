import { useState } from 'react';
import { useGroceriesContext } from '../hooks/useGroceriesContext';

const ItemForm = () => {
    const { dispatch } = useGroceriesContext();
    const [title, setTitle] = useState('');
    const [brand, setBrand] = useState('');
    const [weight, setWeight] = useState('');
    const [error, setError] = useState('');
    const [emptyFields, setEmptyFields] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const groceryItem = {title, brand, weight};
        const response = await fetch('/api/groceries/', {
            method: 'POST',
            body: JSON.stringify(groceryItem),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const json = await response.json();
        
        if (!response.ok) {
            setError(json.error);
            setEmptyFields(json.emptyFields);
        } else {
            setError(null);
            setEmptyFields([]);
            setTitle('');
            setBrand('');
            setWeight('');
            console.log('New Grocery Item Added:', json);
            dispatch({type: 'CREATE_GROCERY_ITEM', payload: json});
        }
    }

    return (
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
            <input 
                type="number"
                onChange={(e) => setWeight(e.target.value)}
                value={weight}
                className={emptyFields.includes('weight') ? 'error' : ''}
            />

            <button>Add Item</button>
            {error && <div className='error'>{error}</div>} 
        </form>
    )
}

export default ItemForm;