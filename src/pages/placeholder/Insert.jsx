import React, { useState } from "react";
import { handleDataInsert } from "../../Script/record.js";



export function Insert() {

    const [itemname, setItemName] = useState('');
    const [amount, setAmount] = useState('');
    const userid = localStorage.getItem('userid');

    const DataInsert = (event) => {
        event.preventDefault();
    
        const formData = new FormData();
        formData.append('itemname', itemname);
        formData.append('amount', amount);
        formData.append('userid', userid);
    
        handleDataInsert(
          'http://localhost:80/Service/insert.php',
          formData, userid
        );
      };

    return(
        <div className="product">
                <form onSubmit={DataInsert} id="insertitem">
                    <div className="inputrow">
                        <div className="inputbox">
                            <label>Enter Item Name</label>
                            <input type="text" 
                            value={itemname} 
                            onChange={(e) => setItemName(e.target.value)}  
                            id="itemname" className="form-control" 
                            name="itemname" placeholder="Item name" 
                            minLength="3" autoComplete="off" 
                            required /><br/><br/>
                        </div>
                        <div className="inputbox">
                            <label>Enter Amount of the Item</label>
                            <input type="text" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            id="amount" className="form-control" 
                            name="amount" placeholder="Amount" 
                            minLength="1" autoComplete="off" 
                            required />
                        </div>
                    </div>
                    <div className="inputrow">
                        <button className ="action" type="submit">Submit</button>
                    </div>
                </form>
            </div>
    );
}

