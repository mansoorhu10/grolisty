import { useState, useEffect, setState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useAuthContext } from "../hooks/useAuthContext";
import { useGroceriesContext } from "../hooks/useGroceriesContext";

const EditableItems = ({extractedData}) => {
    const { user } = useAuthContext();
    const { dispatch } = useGroceriesContext();

    const [items, setItems] = useState([]);
    const [titles, setTitles] = useState('');
    const [brands, setBrands] = useState('');
    const [weights, setWeights] = useState('');
    const [weightUnits, setWeightUnits] = useState('');
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
            const data = {'upcArray': upcArray};

            var response = await fetch(`/api/upc/`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                }
            });

            var json = await response.json();
            productArray = json;
            console.log(productArray);
            setItems(productArray);

            var tempTitles = productArray.map(item => item.title);
            var tempBrands = productArray.map(item => item.brand);
            var tempWeights = productArray.map(item => item.weight);
            var tempWeightUnits = productArray.map(item => item.weightUnit);

            setTitles(tempTitles);
            setBrands(tempBrands);
            setWeights(tempWeights);
            setWeightUnits(tempWeightUnits);
            
            return;
        }

        fetchData();

    }, [extractedData, user.token]);

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
        setError(null);
        setEmptyFields([]);
        setItems([]);
    }

    const changeTitles = (value, key) => {
        console.log('changed titles');
        var newTitles = titles;

        newTitles[key] = value;

        setTitles(newTitles);
    }

    const changeBrands = (value, key) => {
        console.log('changed brands');

        var newBrands = brands;

        newBrands[key] = value;

        setBrands(newBrands);
    }

    const changeWeights = (value, key) => {
        console.log('changed weights');

        var newWeights = weights;

        newWeights[key] = value;

        setWeights(newWeights);
    }

    const changeWeightUnits = (value, key) => {
        console.log('changed weight units');

        var newWeightUnits = weightUnits;

        newWeightUnits[key] = value;

        setWeightUnits(newWeightUnits);
    }



    return (
        <div>
        { items && <form onSubmit={handleSubmit} className="editable-items">
                {items.map((item, index) => (
                    <div className="grocery-details" key={index}>
                        <p><label><strong>Name:</strong></label><input type="text" value={item.title} onChange={(e) => changeTitles(e.target.value, index)}/></p>
                        <p><label><strong>Brand:</strong></label><input type="text" value={item.brand} onChange={(e) => changeBrands(e.target.value, index)}/></p>
                        <p>
                        <label><strong>Weight:</strong></label>
                            <div className="weight">
                                <input 
                                    type="number"
                                    value={item.weight}
                                    className={emptyFields.includes('weight') ? 'error' : ''}
                                    min="0"
                                    onChange={(e) => changeWeights(e.target.value, index)}
                                />
                                <select className="dropdown" defaultValue={item.weightUnit} onChange={(e) => changeWeightUnits(e.target.value, index)}>
                                    <option value="g">g</option>
                                    <option value="kg">kg</option>
                                    <option value="mL">mL</option>
                                    <option value="L">L</option>
                                </select>
                            </div>
                        </p>
                        <span className="material-icon"><DeleteIcon /></span>
                    </div>
                ))}
                <button>Add All Items<i className="material-icon"></i><AddIcon /></button>
            </form>
        }
        </div>
    );
}

export default EditableItems;