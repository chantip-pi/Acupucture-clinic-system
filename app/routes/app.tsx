import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './_SNB.Home';
import AddPatient from './_SNB.AddPatient';
import StaffListView from './_SNB.StaffListView';
import PatientList from './_SNB.PatientList';
import StaffDetail from './_SNB.StaffDetail';
import EditStaff from './_SNB.EditStaff';
import EditPatient from './_SNB.EditPatient';
import PatientDetail from './_SNB.PatientDetail';
import LogIn from './LogIn';
import AddStaff from './_SNB.AddStaff';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/addPatient" element={<AddPatient />} />
        <Route path="/staffListView" element={<StaffListView/>}/>
        <Route path="/patientList" element={<PatientList/>}/>
        <Route path="/staffDetail" element={<StaffDetail />} />
        <Route path="/editStaff" element={<EditStaff />} />
        <Route path="/editPatient" element={<EditPatient />} />
        <Route path="/patientDetail" element={<PatientDetail />} />
        <Route path="/logIn" element={<LogIn/>}/>
        <Route path="/addStaff" element={<AddStaff/>}/>
      </Routes>
    </Router>
  );
}

export default App;
