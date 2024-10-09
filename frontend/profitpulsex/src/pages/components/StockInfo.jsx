import React from "react";
import Card from "./Card";

const StockInfo = ({ stockData }) => (
  <>
    <div className="col-span-1 row-span-1">
      <Card>
        True Stock: {stockData ? stockData.ticker : "Select a stock"}
      </Card>
    </div>
    <div className="col-span-1 row-span-1">
      <Card>
        Predicted Stock: {stockData ? stockData.predicted : "N/A"}
      </Card>
    </div>
  </>
);

export default StockInfo;
