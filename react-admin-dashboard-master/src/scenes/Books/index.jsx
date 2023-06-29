import { Box, useTheme, Button } from "@mui/material";
import { DataGrid,GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import { Link } from "react-router-dom";


const Books = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [books, setBooks] = useState([]);

  const columns = [
     // Updated field name to match the transaction data
     {
      field: "id", // Updated field name to match the transaction data
      headerName: "ID",
      headerAlign: "left",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "title", // Updated field name to match the transaction data
      headerName: "Title",
      headerAlign: "left",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "author",
      headerName: "Author",
      flex: 1,
    },
    {
      field: "stock",
      headerName: "Stock",
      flex: 1,
    },

    {
      field: "update",
      headerName: "",
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          component={Link}
          to={`/books/${params.row.id}`}
        >
          Update
        </Button>
      ),
    },
  
    {
      field: "delete",
      headerName: "",
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
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/books");
        const formattedBooks = response.data.map((book) => ({
          id: book._id + 1,
          ...book,
           // Assign the product's _id to the id field
        }));
        setBooks(formattedBooks);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBooks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/books/${id}`);
      setBooks(books.filter((book) => book.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box m="20px">
      <Header title="BOOKS" subtitle="List of Books" />
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
        <DataGrid rows={books} columns={columns}
        components={{ Toolbar: GridToolbar }} />
      </Box>
    </Box>
  );
};

export default Books;
