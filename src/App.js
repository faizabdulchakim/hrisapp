import React from 'react';
import Box from '@material-ui/core/Box';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import { useLocalStorage } from '@rehooks/local-storage';


import SignIn  from './SignIn.js';
import Dashboard     from './Dashboard.js';



export default function App(){
    const [userdata] = useLocalStorage('u');
		return(
      <Box>
        <Router>
          <Routes >

            <Route path="/dashboard" element={userdata ? userdata.length>0 ?  <Dashboard/> : <Navigate to="/login" /> : <Navigate to="/login" />}>
            </Route>

            <Route path="/login"  element={userdata ? userdata.length>0? <Navigate to="/dashboard" /> : <SignIn/>: <SignIn/>} >
            </Route>

            

          </Routes >
        </Router>
      </Box>
    )
}

