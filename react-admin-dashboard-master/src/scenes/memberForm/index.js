import { Box, Button} from "@mui/material";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import axios from "axios";
import { memberInputs } from "../../formSource";
import { useNavigate } from "react-router-dom";

const MemberForm = () => {
  const [file, setFile] = useState("");
  const [info, setInfo] = useState([]);
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", file);
    setFile("file");
    data.append("upload_preset", "upload");
    try {
      const newMember = {
        ...info,
      };
      await axios.post("http://127.0.0.1:5000/members", newMember);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
  
  console.log(info);

  return (
    <Box m="20px">
      <Header title="CREATE MEMBER" subtitle="Create a New Member" />

      <form onSubmit={handleClick}>
        <Box
          display="grid"
          gap="30px"
          gridTemplateColumns="repeat(4, minmax(0, 1fr))"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
          }}
        >
          {memberInputs.map((input) => (
  <TextField
    key={input.id}
    fullWidth
    variant="filled"
    type={input.type}
    label={input.label}
    onChange={handleChange}
    name={input.id}
    sx={{ gridColumn: input.gridColumn }}
  />
))}

        </Box>
        <Box display="flex" justifyContent="end" mt="20px">
          <Button type="submit" color="secondary" variant="contained">
            Create New Member
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default MemberForm;
