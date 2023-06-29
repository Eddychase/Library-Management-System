import { Box, Button, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UpdateMemberForm = () => {
  const [selectedMember, setSelectedMember] = useState("");
  const [memberData, setMemberData] = useState({});
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { id } = useParams();

  

 

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/members/${id}`);
        const member = response.data;
        // Set the transaction details in the state variables
        setMemberData({
          name: member.name,
          email: member.email,
          phone_number: member.phone_number,
        });
        
      } catch (error) {
        console.log(error);
      }
    };
    fetchTransaction();
  }, [id]);

  

  const handleMemberDataChange = (e) => {
    setMemberData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedMember = {
        ...memberData,
      };
      await axios.put(`http://127.0.0.1:5000/members/${id}`, updatedMember);
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
            label="Name"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleMemberDataChange}
            name="name"
            value={memberData.name || ""}
            sx={{ gridColumn: "1 / span 2" }}
          />
          <TextField
  fullWidth
  variant="filled"
  type="text"
  label="Email"
  InputLabelProps={{
    shrink: true,
  }}
  onChange={handleMemberDataChange}
  name="email" // Updated name attribute to "email"
  value={memberData.email || ""}
  sx={{ gridColumn: "3 / span 2" }}
/>
<TextField
  fullWidth
  variant="filled"
  type="number"
  label="Phone Number"
  onChange={handleMemberDataChange}
  name="phone_number" // Updated name attribute to "phone_number"
  value={memberData.phone_number || ""}
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

export default UpdateMemberForm;
