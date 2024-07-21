import { useState, useEffect } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useAuthContext } from "../hooks/useAuthContext";
import { useGroceriesContext } from "../hooks/useGroceriesContext";

const EditableItems = ({extractedData}) => {
    const { user } = useAuthContext();
    const { dispatch } = useGroceriesContext();

    const [modal, setModal] = useState(false);

    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);
    const [emptyFields, setEmptyFields] = useState([]);

    useEffect(() => {
        var data = extractedData.data;
        const lines = data.lines;
        const universalProductCode = new RegExp("[0|(|)]+[0-9]{10,11}");
        var upcArray = [];
        
        for (let i = 0; i < lines.length; i++){
            let singleLineArray = universalProductCode.exec(lines[i].text);

            // if(singleLineArray[0] === '(' || singleLineArray[0] === ')'){
            //     singleLineArray[0] = '0';
            // }

            if(singleLineArray){
                upcArray.push(singleLineArray[0]);
            }
        }
        
        console.log(upcArray);

        const fetchData = async () => {
            let productArray = [];
            const data = {'upcArray': upcArray};

            var response = await fetch(`/api/receipt/`, {
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
            
            return;
        }

        fetchData();

    }, [extractedData, user.token]);

    const toggleModal = () => {
        setModal(!modal);
    };

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
            var response = await fetch('/api/groceries/', {
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
        extractedData = null;
    }

    const changeTitles = (e, key) => {
        console.log('changed titles');

        var tempProducts = items;
        var value = e.target.value;

        tempProducts[key].title = value;
        console.log(tempProducts);
        setItems(tempProducts);
    }

    const changeBrands = (e, key) => {
        console.log('changed brands');

        var tempProducts = items;
        var value = e.target.value;

        tempProducts[key].brand = value;
        setItems(tempProducts);
    }

    const changeWeights = (e, key) => {
        console.log('changed weights');

        var tempProducts = items;
        var value = e.target.value;

        tempProducts[key].weight = value;
        setItems(tempProducts);
    }

    const changeWeightUnits = (e, key) => {
        console.log('changed weight units');

        var tempProducts = items;
        var value = e.target.value;

        tempProducts[key].weightUnit = value;
        setItems(tempProducts);
    }

    const handleClick = (key) => {
        if (!user) {
            return;
        }

        setItems(items => items.filter((item) => item.id !== key));

        console.log(items)
    }

    if (modal) {
        document.body.classList.add('active-modal')
    } else {
        document.body.classList.remove('active-modal')
    }

    return (
        <>
            <button onClick={toggleModal} className="btn-modal">Open</button>
            
            {modal && (
                <div className="modal">
                    <div onClick={toggleModal} className="overlay"></div>
                    <div className="modal-content">
                        { items && <form onSubmit={handleSubmit} className="editable-items">
                            <div className="top-bar">
                                <h3>Your Imported Items</h3>
                                <div className="close-modal" onClick={toggleModal}><CloseIcon /></div>
                            </div>
                            {items.map((item) => (
                                <div className="product-details" key={item.id}>
                                    <div className="delete-icon" onClick={() => handleClick(item.id)}><DeleteIcon /></div>
                                    <p><label><strong>Name:</strong></label><input type="text" defaultValue={item.title} onChange={(e) => changeTitles(e, item.id)}/></p>
                                    <p><label><strong>Brand:</strong></label><input type="text" defaultValue={item.brand} onChange={(e) => changeBrands(e, item.id)}/></p>
                                    <div className="weight-group">
                                        <p><label><strong>Weight:</strong></label></p>
                                        <div className="weight">
                                            <input 
                                                type="number"
                                                defaultValue={item.weight}
                                                className={emptyFields.includes('weight') ? 'error' : ''}
                                                min="0"
                                                onChange={(e) => changeWeights(e, item.id)}
                                            />
                                            <select className="dropdown" defaultValue={item.weightUnit} onChange={(e) => changeWeightUnits(e, item.id)}>
                                                <option value="g">g</option>
                                                <option value="kg">kg</option>
                                                <option value="mL">mL</option>
                                                <option value="L">L</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div className="bottom-bar">
                                <button>Add All Items<i className="material-icon"><AddIcon /></i></button>
                            </div>
                        </form>
                        }
                    </div>
                </div>
            )}
        </>
    );
}

export default EditableItems;