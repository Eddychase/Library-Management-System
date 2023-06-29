import { Box, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UpdateBookForm = () => {
  const [selectedBook, setSelectedBook] = useState("");
  const [bookData, setBookData] = useState({});
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { id } = useParams();

  

 

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/books/${id}`);
        const book = response.data;
        // Set the transaction details in the state variables
        setBookData({
          title: book.title,
          author: book.author,
          stock: book.stock,
        });
        
      } catch (error) {
        console.log(error);
      }
    };
    fetchBook();
  }, [id]);

  

  const handleBookDataChange = (e) => {
    setBookData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedBook = {
        ...bookData,
      };
      await axios.put(`http://127.0.0.1:5000/books/${id}`, updatedBook);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box m="20px">
      <Header title="UPDATE USER" subtitle="Update Transaction Details" />
      

      <form onSubmit={handleSubmit}>
        <Box
          display="grid"
          gap="30px"
          marginTop="20px"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
          <TextField
            fullWidth
            variant="filled"
            type="text"
            label="Title"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleBookDataChange}
            name="title"
            value={bookData.title || ""}
            sx={{ gridColumn: "1 / span 2" }}
          />
          <TextField
  fullWidth
  variant="filled"
  type="text"
  label="Author"
  InputLabelProps={{
    shrink: true,
  }}
  onChange={handleBookDataChange}
  name="author" // Updated name attribute to "email"
  value={bookData.author || ""}
  sx={{ gridColumn: "3 / span 2" }}
/>
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="Stock"
  onChange={handleBookDataChange}
  name="stock" // Updated name attribute to "phone_number"
  value={bookData.stock || ""}
  sx={{ gridColumn: "1 / span 4" }}
/>
        </Box>
        <Box display="flex" justifyContent="end" mt="20px">
          <Button type="submit" color="secondary" variant="contained">
            Update Transaction
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default UpdateBookForm;
