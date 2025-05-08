import React from "react";
import '../Design/product.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

function Product() {
  return (
    <main>
      <div className="main">
        <p>Product</p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
          euismod dolor in velit gravida, sit amet volutpat lorem dapibus.
        </p>
      </div>
      <div className="content product-content">
        {/* To be moved to another file */}
            <div className="product">
                <form method="post" id="insertitem">
                    <div className="row">
                        <div className="inputbox">
                            <label>Enter Item Name</label>
                            <input type="text" id="itemname" className="form-control" name="itemname" placeholder="Item name" minLength="3" autoComplete="off" required /><br/><br/>
                        </div>
                        <div className="inputbox">
                            <label>Enter Amount of the Item</label>
                            <input type="text" id="amount" className="form-control" name="amount" placeholder="Amount" minLength="1" autoComplete="off" required />
                        </div>
                    </div>
                    <div className="row">
                        <button className ="action" type="submit">Submit</button>
                    </div>
                </form>
            </div>
            {/* To be moved to another file */}
            <div className="product">
                <form method="post" id="searchform">
                    <h2>Search your ordered items</h2>
                    <div className="search-container">
                        <div className="searchbox">
                            <input type="text" id="keyword" className="form-control" name="keyword" placeholder="Search" autoComplete="off" />
                            <button type="submit" className="search"><FontAwesomeIcon icon={faSearch} /></button>
                        </div>
                    </div>
                </form>

                <div className="tabledata">
                    <table className="resultsTable">
                    </table>
                    <nav className="pagination-container"></nav> 
                </div>
            </div>
        </div>
    </main>
  );
}

export default Product;
