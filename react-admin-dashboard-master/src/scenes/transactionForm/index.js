import { Box, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TransactionForm = () => {
  const [memberList, setMemberList] = useState([]);
  const [selectedMember, setSelectedMember] = useState("");
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [transactionData, setTransactionData] = useState({});
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/members");
        setMemberList(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchMembers();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/books");
        const formattedBooks = response.data.map((book) => ({
          id: book.id,
          ...book,
        }));
        setBooks(formattedBooks);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBooks();
  }, []);

  const handleMemberChange = (e) => {
    setSelectedMember(e.target.value);
  };

  const handleBookChange = (e) => {
    setSelectedBook(e.target.value);
  };

  const handleTransactionDataChange = (e) => {
    setTransactionData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTransaction = {
        ...transactionData,
        member_id: selectedMember,
        book_id: selectedBook,
        
      };
      console.log(newTransaction)
      await axios.post(
        "http://127.0.0.1:5000/transactions",
        newTransaction
      );
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box m="20px">
      <Header title="CREATE USER" subtitle="Create a New Transaction" />
      <FormControl>
        <InputLabel>Select a Member</InputLabel>
        <Select
          style={{ width: "300px", border: "1px solid white", color: "#093637" }}
          value={selectedMember}
          onChange={handleMemberChange}
        >
          <MenuItem value="">
            <em>-- Select a member --</em>
          </MenuItem>
          {memberList.map((member) => (
            <MenuItem key={member.id} value={member.id}>
              {member.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel>Select a Book</InputLabel>
        <Select
          style={{ width: "300px", border: "1px solid white", color: "#093637" }}
          value={selectedBook}
          onChange={handleBookChange}
        >
          <MenuItem value="">
            <em>-- Select a book --</em>
          </MenuItem>
          {books.map((book) => (
            <MenuItem key={book.id} value={book.id}>
              {book.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

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
    type="date"
    label="Issue Date"
    InputLabelProps={{
      shrink: true,
    }}
    onChange={handleTransactionDataChange}
    name="issue_date"
    sx={{ gridColumn: "1 / span 2" }}
  />

        </Box>
        <Box display="flex" justifyContent="end" mt="20px">
          <Button type="submit" color="secondary" variant="contained">
            Create New Transaction
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default TransactionForm;
