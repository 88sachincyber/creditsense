import { useEffect, useState } from "react";
import API from "../services/api";

function TransactionTable(){

  const [transactions,setTransactions] = useState([]);

  useEffect(()=>{

    fetchTransactions();

  },[]);

  const fetchTransactions = async () => {

    try{

      const res = await API.get("/transactions");

      setTransactions(res.data);

    }catch(err){

      console.log(err);

    }

  };

  return(

    <div>

      <h2>Transactions</h2>

      <table border="1" cellPadding="10">

        <thead>

          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Type</th>
          </tr>

        </thead>

        <tbody>

          {transactions.map((t)=>(
            <tr key={t.id}>

              <td>{t.date}</td>
              <td>{t.description}</td>
              <td>{t.amount}</td>
              <td>{t.category}</td>
              <td>{t.type}</td>

            </tr>
          ))}

        </tbody>

      </table>

    </div>
  );

}

export default TransactionTable;