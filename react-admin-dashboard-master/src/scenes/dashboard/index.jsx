import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import InventoryIcon from '@mui/icons-material/Inventory';
import PaidIcon from '@mui/icons-material/Paid';
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ReceiptIcon from '@mui/icons-material/Receipt';
import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import StatBox from "../../components/StatBox";
import React, { useState, useEffect } from "react";
import axios from "axios";



const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [weeklyTotalPrice, setWeeklyTotalPrice] = useState(0);
  const [monthlyTotalPrice, setMonthlyTotalPrice] = useState(0);
  const [dailyTotalPrice, setDailyTotalPrice] = useState([]);
  const [latestTransactions, setLatestTransactions] = useState([])
  const [totalEarnings,setTotalEarnings]= useState(0)
  // ...

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/transactions");
        const transactions = response.data;
        const numTransactions = transactions.length;
        const total = transactions.reduce(
          (acc, transaction) => acc + transaction.fee,
          0
        );
        
        setTotalTransactions(numTransactions);
        setTotalEarnings(total);

        // Filter transactions for today
        const today = new Date();
        const todayTransactions = transactions.filter((transaction) => {
          const transactionDate = new Date(transaction.issue_date);
          return (
            transactionDate.getDate() === today.getDate() &&
            transactionDate.getMonth() === today.getMonth() &&
            transactionDate.getFullYear() === today.getFullYear()
          );
        });

        // Calculate total price for today's transactions
        const todayTotalPrice = todayTransactions.reduce(
          (acc, transaction) => acc + transaction.fee,
          0
        );
        setDailyTotalPrice(todayTotalPrice);

        // Filter transactions for this week
        const firstDayOfWeek = new Date(
          today.setDate(today.getDate() - today.getDay())
        );
        const lastDayOfWeek = new Date(
          today.setDate(today.getDate() + (6 - today.getDay()))
        );
        const weekTransactions = transactions.filter((transaction) => {
          const transactionDate = new Date(transaction.issue_date);
          return (
            transactionDate >= firstDayOfWeek &&
            transactionDate <= lastDayOfWeek
          );
        });

        // Calculate total price for this week's transactions
        const weekTotalPrice = weekTransactions.reduce(
          (acc, transaction) => acc + transaction.fee,
          0
        );
        setWeeklyTotalPrice(weekTotalPrice);

        // Filter transactions for this month
        const monthTransactions = transactions.filter((transaction) => {
          const transactionDate = new Date(transaction.issue_date);
          return (
            transactionDate.getMonth() === today.getMonth() &&
            transactionDate.getFullYear() === today.getFullYear()
          );
        });

        // Calculate total price for this month's transactions
        const monthTotalPrice = monthTransactions.reduce(
          (acc, transaction) => acc + transaction.fee,
          0
        );
        setMonthlyTotalPrice(monthTotalPrice);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTransactions();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/books");
        const books = response.data;
        const numBooks = books.length;
        setTotalBooks(numBooks);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchMembers = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/members");
        const members = response.data;
        const numMembers = members.length;
        setTotalMembers(numMembers);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBooks();
    fetchMembers();
  }, []);

  useEffect(() => {
    const fetchLatestTransactions = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/transactions");
        const transactions = response.data;
        const latest = transactions.slice(-5); // Get the latest 5 transactions
        setLatestTransactions(latest);
      } catch (error) {
        console.log(error);
      }
    };

    fetchLatestTransactions();
  }, []);

  

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

        
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
        sx={{ borderRadius: '5px', boxShadow: 4 }}
          gridColumn="span 3"
          backgroundColor="#000000"
          display="flex"
          alignItems="center"
          justifyContent="center"
          box-shadow="rgba(0, 0, 0, 0.35) 0px 5px 15px"
        >
          <StatBox
              title={totalBooks}
              subtitle="Books Available"
              progress="0.75"
              
              icon={
                <PersonAddIcon
                  sx={{ color: "#52c234", fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
        sx={{ borderRadius: '5px', boxShadow: 4 }}
          gridColumn="span 3"
          backgroundColor="#000000"
          display="flex"
          alignItems="center"
          justifyContent="center"
          box-shadow="rgba(0, 0, 0, 0.35) 0px 5px 15px"
        >
          <StatBox
            title={totalMembers}
            subtitle="Members Available"
            progress="0.50"
            
            icon={
              <InventoryIcon
                sx={{ color: "#52c234", fontSize: "26px" }}
              />
            }
          />
        </Box>
        <Box
        sx={{ borderRadius: '5px', boxShadow: 4 }}
          gridColumn="span 3"
          backgroundColor="#000000"
          display="flex"
          alignItems="center"
          justifyContent="center"
          box-shadow="rgba(0, 0, 0, 0.35) 0px 5px 15px"
        >
          <StatBox
            title={totalTransactions}
            subtitle="Transactions Made"
            progress="0.30"
            
            icon={
              <ReceiptIcon
                sx={{ color: "#52c234", fontSize: "26px" }}
              />
            }
          />
        </Box>
        

        {/* ROW 2 */}
        <Box
          gridColumn="span 8"
          gridRow="span 2"
          backgroundColor="#000000"
          sx={{ borderRadius: '5px', boxShadow: 4 }}
        >
          <Box
            mt="25px"
            p="0 30px"
            display="flex "
            justifyContent="space-between"
            alignItems="center"
          >
            
            <Box>
              <IconButton>
                <DownloadOutlinedIcon
                  sx={{ fontSize: "26px", color: "#52c234" }}
                />
              </IconButton>
            </Box>
          </Box>
          <Box height="250px" m="-20px 0 0 0">
            <LineChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn="span 4"
          gridRow="span 2"
          backgroundColor="#000000"
          overflow="auto"
          sx={{ borderRadius: '5px', boxShadow: 4 }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            borderBottom={`4px solid ${colors.primary[500]}`}
            backgroundColor="#000000"
            colors={colors.grey[100]}
            p="15px"
          >
            <Typography color="#fff" variant="h5" fontWeight="600">
              Recent Transactions
            </Typography>
          </Box>
          {latestTransactions.map((transaction, i) => (
            <Box
              key={`${transaction.id}-${i}`}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[500]}`}
              p="15px"
            >
              <Box>
                <Typography
                  color="#fff"
                  variant="h5"
                  fontWeight="600"
                >
                  {transaction.book.title}
                </Typography>
                
              </Box>
              <Box color={colors.grey[100]}>{transaction.member.name}</Box>
              <Box
                color="#fff"
                p="5px 10px"
                borderRadius="4px"
              >
                {transaction.issue_date}
              </Box>
              
            </Box>
          ))}
        </Box>

        
        
      </Box>
    </Box>
  );
};

export default Dashboard;
