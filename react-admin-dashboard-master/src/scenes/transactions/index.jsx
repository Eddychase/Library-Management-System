import { Box, useTheme, Button } from "@mui/material";
import { DataGrid,GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import { Link } from "react-router-dom";



const Transactions = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [transactions, setTransactions] = useState([]);

  const columns = [
    {
      field: "id", // Updated field name to match the transaction data
      headerName: "ID",
      headerAlign: "left",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "book_title",
      headerName: "Title",
      headerAlign: "left",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "member_name",
      headerName: "Member",
      flex: 1,
    },
    {
      field: "issue_date",
      headerName: "Issue Date",
      flex: 1,
    },
    {
      field: "return_date",
      headerName: "return date",
      flex: 1,
    },
    {
      field: "fee",
      headerName: "Fee",
      flex: 1,
    },

    {
      field: "Return Book",
      headerName: "Return Book",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => handleReturn(params.row.id)}
        >
          Return 
        </Button>
      ),
    },

    {
      field: "update",
      headerName: "Update",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          component={Link}
          to={`/transactions/${params.row.id}`}
        >
          Update
        </Button>
      ),
    },


    {
      field: "delete",
      headerName: "Delete",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => handleDelete(params.row.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  

  useEffect(() => {
    // Fetch transactions and update fees from localStorage
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/transactions");
        const formattedTransactions = response.data.map((transaction) => {
          const issueDate = new Date(transaction.issue_date);
          const returnDate = transaction.return_date ? new Date(transaction.return_date) : new Date();
          const daysDiff = Math.floor((returnDate - issueDate) / (1000 * 60 * 60 * 24));
          const fee = daysDiff > 10 ? 500 : 50 * daysDiff;
          
          return {
            ...transaction,
            book_title: transaction.book.title,
            member_name: transaction.member.name,
            fee: fee,
          };
        });
        setTransactions(formattedTransactions);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTransactions();
  }, []);
  
  useEffect(() => {
    // Retrieve transactions from localStorage if available
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    } else {
      fetchTransactions();
    }
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/transactions');
      const formattedTransactions = response.data.map((transaction) => {
        // Format transaction data...
      });
      setTransactions(formattedTransactions);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Save transactions to localStorage whenever it changes
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);


  const handleReturn = async (id) => {
    try {
      const transaction = transactions.find((transaction) => transaction.id === id);
      
      // Set the return date as the current date
      const currentDate = new Date();
      transaction.return_date = currentDate.toISOString(); // Convert to string format
      
      // Set the book_id for the transaction
      const bookId = transaction.book.id;
  
      // Update the transaction in the database
      await axios.post(`http://127.0.0.1:5000/transactions/${id}`, transaction);
      
      // Add the book back to the stock
      await axios.post(`http://127.0.0.1:5000/books/${bookId}/return`);
  
      // Update the return date and fee in the local state
      const updatedTransactions = transactions.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            fee: transaction.fee,
            return_date: transaction.return_date,
          };
        }
        return t;
      });
      setTransactions(updatedTransactions);
    } catch (error) {
      console.log(error);
    }
  };
  


  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/transactions/${id}`);
      setTransactions(transactions.filter((transaction) => transaction.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box m="20px">
      <Header title="TRANSACTIONS" subtitle="List of Transactions" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: "#fff",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#000000",
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: "#093637",
            
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: "#0f2027",
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid rows={transactions} columns={columns} components={{ Toolbar: GridToolbar }} />
      </Box>
    </Box>
  );
};

export default Transactions;