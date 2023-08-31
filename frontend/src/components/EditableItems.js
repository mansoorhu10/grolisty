import { useState, useEffect, setState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useAuthContext } from "../hooks/useAuthContext";
import { useGroceriesContext } from "../hooks/useGroceriesContext";

const EditableItems = ({extractedData}) => {
    const { user } = useAuthContext();
    const { dispatch } = useGroceriesContext;

    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);
    const [emptyFields, setEmptyFields] = useState([]);
    

    useEffect(() => {
        var data = extractedData.data;
        const lines = data.lines;
        const universalProductCode = new RegExp("0+[0-9]{10,11}");
        var upcArray = [];
        
        for (let i = 0; i < lines.length; i++){
            let singleLineArray = universalProductCode.exec(lines[i].text);
            if(singleLineArray){
                upcArray.push(singleLineArray[0]);
            }  
        }
        
        console.log(upcArray);

        const fetchData = async () => {
            let productArray = [];

            for (let i = 0; i < upcArray.length; i++){
                var response = await fetch(`/api/upc/${upcArray[i]}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${user.token}`
                    }
                });
    
                var json = await response.json();
                productArray.push(json);
            }

            console.log(productArray);

            setItems(productArray);
            return;
        }

        fetchData();

    }, [extractedData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setError('You must be logged in');
            return;
        }
        
        const groceryItems = items;

        console.log(groceryItems);

        for (let i = 0; i < groceryItems.length; i++){
            console.log(groceryItems[i]);
            var response = await fetch('/api/groceries', {
                method: 'POST',
                body: JSON.stringify(groceryItems[i]),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });
    
            var json = await response.json();
            
            if (!response.ok) {
                setError(json.error);
                setEmptyFields(json.emptyFields);
                console.log(json.emptyFields);
            } 
            if (response.ok) {
                setError(null);
                setEmptyFields([]);
                console.log('New Grocery Item Added:', json);
                dispatch({type: 'CREATE_GROCERY_ITEM', payload: json});
            }
        }
    }

    return (
        <div>
        { items && <form onSubmit={handleSubmit} className="editable-items">
                {items.map((item) => (
                    <div className="grocery-details">
                        <label>Name:</label><input type="text" value={item.title} />
                        <p><label><strong>Brand: </strong></label><input type="text" value={item.brand} /></p>
                        <p><label><strong>Weight (g): </strong></label><input type="text" value={item.weight} /></p>
                        <span><DeleteIcon /></span>
                    </div>
                ))}
                <button>Add All Items<AddIcon /></button>
            </form>
        }
        </div>
    );
}

export default EditableItems;