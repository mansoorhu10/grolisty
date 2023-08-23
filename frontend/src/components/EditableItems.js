import { useState, useEffect } from "react";
import DeleteIcon from '@mui/icons-material/Delete';

const EditableItems = ({extractedData}) => {
    const [items, setItems] = useState([]);
    const [error, setError] = useState(null);
    const [emptyFields, setEmptyFields] = useState([]);

    useEffect(() => {
        var data = extractedData.data;
        const lines = data.lines;
        const universalProductCode = new RegExp("0+[0-9]{11}");
        var upcArray = [];
        
        for (let i = 0; i < lines.length; i++){
            let singleLineArray = universalProductCode.exec(lines[i].text);
            if(singleLineArray){
                upcArray.push(singleLineArray[0]);
            }  
        }
        
        console.log(upcArray);

    }, [extractedData]);

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     if (!user) {
    //         setError('You must be logged in');
    //         return;
    //     }
        
    //     const groceryItem = {title, brand, weight};

    //     const response = await fetch('/api/groceries', {
    //         method: 'POST',
    //         body: JSON.stringify(groceryItem),
    //         headers: {
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${user.token}`
    //         }
    //     });

    //     const json = await response.json();
        
    //     if (!response.ok) {
    //         setError(json.error);
    //         setEmptyFields(json.emptyFields);
    //         console.log(json.emptyFields);
    //     } 
    //     if (response.ok) {
    //         setTitle('');
    //         setBrand('');
    //         setWeight('');
    //         setError(null);
    //         setEmptyFields([]);
    //         console.log('New Grocery Item Added:', json);
    //         dispatch({type: 'CREATE_GROCERY_ITEM', payload: json});
    //     }
    // }

    return (
        <form className="editable-items">
            <div className="grocery-details">
                { items && items.map((item) => {
                    <div>
                        <h4><input type="text" value={item.title} /></h4>
                        <p><strong>Brand: </strong><input type="text" value={item.brand} /></p>
                        <p><strong>Weight (g): </strong><input type="text" value={item.weight} /></p>
                        <span><DeleteIcon /></span>
                    </div>
                }) }
            </div>
        </form>
    );
}

export default EditableItems;