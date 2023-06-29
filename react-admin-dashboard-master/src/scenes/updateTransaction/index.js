import { Box, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UpdateTransactionForm = () => {
  const [memberList, setMemberList] = useState([]);
  const [selectedMember, setSelectedMember] = useState("");
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState("");
  const [transactionData, setTransactionData] = useState({});
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { id } = useParams();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/members");
        const formattedMembers = response.data.map((member) => ({
          id: member.id + 1,
          ...member,
        }));
        setMemberList(formattedMembers);
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
          id: book.id + 1,
          ...book,
        }));
        setBooks(formattedBooks);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/transactions/${id}`);
        const transaction = response.data;
        // Set the transaction details in the state variables
        setTransactionData({
          issue_date: transaction.issue_date,
          return_date: transaction.return_date,
          fee: transaction.fee,
        });
        setSelectedMember(transaction.member.id);
        setSelectedBook(transaction.book.id);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTransaction();
  }, [id]);

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
      const updatedTransaction = {
        ...transactionData,
        member_id: selectedMember,
        book_id: selectedBook,
      };
      await axios.put(`http://127.0.0.1:5000/transactions/${id}`, updatedTransaction);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box m="20px">
      <Header title="UPDATE USER" subtitle="Update Transaction Details" />
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
            value={transactionData.issue_date || ""}
            sx={{ gridColumn: "1 / span 2" }}
          />
          <TextField
            fullWidth
            variant="filled"
            type="date"
            label="Return Date"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleTransactionDataChange}
            name="return_date"
            value={transactionData.return_date || ""}
            sx={{ gridColumn: "3 / span 2" }}
          />
          <TextField
            fullWidth
            variant="filled"
            type="number"
            label="Fee"
            onChange={handleTransactionDataChange}
            name="fee"
            value={transactionData.fee || ""}
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

export default UpdateTransactionForm;
