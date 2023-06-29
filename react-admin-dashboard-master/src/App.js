import { useState, useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Transaction from "./scenes/transactions";
import Members from "./scenes/members";
import Books from "./scenes/Books";
import Bar from "./scenes/bar";
import MemberForm from "./scenes/memberForm";
import TransactionForm from "./scenes/transactionForm";
import UpdateTransactionForm from "./scenes/updateTransaction";
import UpdateMemberForm from "./scenes/updateMember";
import UpdateBookForm from "./scenes/updateBook";
import BookForm from "./scenes/bookForm";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import Users from "./scenes/users";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import Login from "./scenes/login";



function App(user) {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
/*
  const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (!user) {
      return <Navigate to="/login" />;
    }

    return children;
  };
*/

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
      
                    <Dashboard />
                
                }
              />
              <Route
                path="/transactions"
                element={
                 
                    <Transaction />
               
                }
              />
              <Route
                path="/books"
                element={
                 
                    <Books />
                
                }
              />
              <Route
                path="/members"
                element={
              
                    <Members />
       
                }
              />
              <Route
                path="/transactionform"
                element={
             
                    <TransactionForm />
       
                }
              />
              <Route
  path="/transactions/:id/"
  element={<UpdateTransactionForm />}
/>
              <Route
                path="/users"
                element={
        
                    <Users />
           
                }
              />
              <Route
                path="/memberForm"
                element={
           
                    <MemberForm />
     
                }
                
              />

<Route
  path="/members/:id/"
  element={<UpdateMemberForm />}
/>
              <Route
                path="/bookForm"
                element={
  
                    <BookForm />
    
                }
              />

<Route
  path="/books/:id/"
  element={<UpdateBookForm />}
/>

              <Route
                path="/bar"
                element={

                    <Bar />
       
                }
              />
              <Route
                path="/pie"
                element={
               
                    <Pie />
           
                }
              />
              <Route
                path="/line"
                element={
               
                    <Line />
                
                }
              />
              <Route
                path="/faq"
                element={
         
                    <FAQ />
         
                }
              />
              <Route
            path="/calendar"
            element={

                <Calendar />

            }
          />
          <Route
            path="/geography"
            element={
      
                <Geography />
          
            }
          />
        </Routes>
      </main>
    </div>
  </ThemeProvider>
</ColorModeContext.Provider>
);
}

export default App;