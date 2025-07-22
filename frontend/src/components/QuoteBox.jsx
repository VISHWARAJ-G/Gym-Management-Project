import React from "react";
import { quotes } from "../services/Quotes";

function QuoteBox() {
  const quotesList = quotes;
  const index = new Date().getDate() % quotesList.length;
  const todayQuote = quotesList[index];
  return (
    <div className="bg-black mt-24 text-center py-4 font-poppins font-extrabold text-2xl text-white hidden md:block">
      {`💪 "${todayQuote}" 💪`}
    </div>
  );
}

export default QuoteBox;
