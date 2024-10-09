import React from "react";
import Card from "./Card";

const StockButtons = ({ handleCardClick }) => (
  <>
    <div className="col-span-1 row-span-1" onClick={() => handleCardClick("TSLA")}>
      <Card>Tesla</Card>
    </div>
    <div className="col-span-1 row-span-1" onClick={() => handleCardClick("GM")}>
      <Card>GM</Card>
    </div>
    <div className="col-span-1 row-span-1" onClick={() => handleCardClick("F")}>
      <Card>Ford</Card>
    </div>
    <div className="col-span-1 row-span-1"></div> {/* Empty space */}
  </>
);

export default StockButtons;
