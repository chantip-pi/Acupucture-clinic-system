import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './_SNB.Home';
import AddPatient from './_SNB.AddPatient';
import TotalCost from './_SNB.TotalCost';
import TreatmentSelect from './_SNB.TreatmentSelect';
import StaffListView from './_SNB.StaffListView';
import Equipment from './Equipment';
import IncomeExpenses from './_SNB.IncomeExpenses';
import PatientList from './_SNB.PatientList';
import MedicalRecord from './MedicalRecord';
import EquipmentHistory from './_SNB.EquipmentHistory';
import StaffDetail from './_SNB.StaffDetail';
import EditStaff from './_SNB.EditStaff';
import EditPatient from './_SNB.EditPatient';
import PatientDetail from './_SNB.PatientDetail';
import LogIn from './LogIn';
import AddStaff from './_SNB.AddStaff';
import AcupunctureSelect from './_SNB.AcupunctureSelect';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/addPatient" element={<AddPatient />} />
        <Route path="/selectTreatment" element={<TreatmentSelect />} />
        <Route path="/totalCost" element={<TotalCost />} />
        <Route path="/staffListView" element={<StaffListView/>}/>
        <Route path="/equipment" element={<Equipment />} />
        <Route path="/incomeExpenses" element={<IncomeExpenses />} />
        <Route path="/patientList" element={<PatientList/>}/>
        <Route path="/medicalRecord" element={<MedicalRecord/>}/>
        <Route path="/equimentHistory" element={<EquipmentHistory />} />
        <Route path="/staffDetail" element={<StaffDetail />} />
        <Route path="/editStaff" element={<EditStaff />} />
        <Route path="/editPatient" element={<EditPatient />} />
        <Route path="/patientDetail" element={<PatientDetail />} />
        <Route path="/treatmentSelect" element={<TreatmentSelect />} />
        <Route path="/logIn" element={<LogIn/>}/>
        <Route path="/addStaff" element={<AddStaff/>}/>
        <Route path="/acupunctureSelect" element={<AcupunctureSelect/>}/>
      </Routes>
    </Router>
  );
}

export default App;
