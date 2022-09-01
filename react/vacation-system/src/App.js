import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import PrivateRoute from './PrivateRoute/PrivateRoute';
import Home from './components/Home/Home';
import User from './components/User/User';
import CreateUser from './components/User/CreateUser';
import UpdateUser from './components/User/UpdateUser';
import Department from './components/Department/Department';
import CreateDepartment from './components/Department/CreateDepartment';
import UpdateDepartment from './components/Department/UpdateDepartment';
import CreateTimeOff from './components/TimeOff/CreateTimeOff';
import TimeOff from './components/TimeOff/TimeOff';
import UpdateTimeOff from './components/TimeOff/UpdateTimeOff';
import TimeOffCurrentUser from './components/TimeOff/TimeOffCurrentUser';
import ManageTimeOff from './components/TimeOff/ManageTimeOff';

function App() {
  return (
    <div className="wrapper">
      <h1 className="vacationSystem">Vacation System</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } />
          <Route className="department" path="/department" element={
            <PrivateRoute>
              <Department />
            </PrivateRoute>
          } />
          <Route path="/createDepartment" element={
            <PrivateRoute>
              <CreateDepartment />
            </PrivateRoute>
          } />
          <Route path="/updateDepartment" element={
            <PrivateRoute>
              <UpdateDepartment />
            </PrivateRoute>
          } />
          <Route path="/user" element={
            <PrivateRoute>
              <User />
            </PrivateRoute>
          } />
          <Route path="/createUser" element={
            <PrivateRoute>
              <CreateUser />
            </PrivateRoute>
          } />
          <Route path="/updateUser" element={
            <PrivateRoute>
              <UpdateUser />
            </PrivateRoute>
          } />
          <Route path="/timeOff" element={
            <PrivateRoute>
              <TimeOff />
            </PrivateRoute>
          } />
          <Route path="/timeOffCurrentUser" element={
            <PrivateRoute>
              <TimeOffCurrentUser />
            </PrivateRoute>
          } />
          <Route path="/createTimeOff" element={
            <PrivateRoute>
              <CreateTimeOff />
            </PrivateRoute>
          } />
          <Route path="/updateTimeOff" element={
            <PrivateRoute>
              <UpdateTimeOff />
            </PrivateRoute>
          } />
          <Route path="/manageTimeOff" element={
            <PrivateRoute>
              <ManageTimeOff />
            </PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;