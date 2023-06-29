import { Box, useTheme, Button } from "@mui/material";
import { DataGrid,GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/Header";
import { Link } from "react-router-dom";

const Members = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [members, setMembers] = useState([]);


  

  const columns = [
     // Updated field name to match the transaction data
    {
      field: "name", // Updated field name to match the transaction data
      headerName: "Name",
      headerAlign: "left",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "phone_number", // Updated field name to match the transaction data
      headerName: "PHone Number",
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
          to={`/members/${params.row.id}`}
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
    const fetchMembers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/members");
        const formattedMembers = response.data.map((member) => ({
          id: member._id,
          ...member,
        }));
        setMembers(formattedMembers);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMembers();
  }, []);

  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/members/${id}`);
      setMembers(members.filter((member) => member.id !== id));
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <Box m="20px">
      <Header title="MEMBERS" subtitle="List of Members" />
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
            color: "fff",
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
        <DataGrid rows={members} columns={columns}
        components={{ Toolbar: GridToolbar }} />
      </Box>
    </Box>
  );
};

export default Members;
