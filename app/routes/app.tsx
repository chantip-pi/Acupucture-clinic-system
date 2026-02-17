
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
import AcupunctureCreate from './_SNB.AcupunctureCreate';
import AcupunctureLibrary from './_SNB.AcupunctureLibrary';
import AcupunctureShowPage from './_SNB.AcupunctureShowPage';
import CreateMedicalRecord from './_SNB.CreateMedicalRecord';
import MedicalRecordDetail from './_SNB.MedicalRecordDetail';
import Suggest from './_SNB.Suggest';
import IllnessAcupunctureShow from './_SNB.IllnessAcupunctureShow';
import CreateIllness from './_SNB.CreateIllness';
import MeridianLibrary from './_SNB.MeridianLibrary';
import MeridianAcupunctureShow from './_SNB.MeridianAcupunctureShow';
import MedicalRecordIllnessShowPage from './_SNB.MedicalRecordIllnessShowPage';

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
        <Route path="/acupunctureCreate" element={<AcupunctureCreate/>}/>
        <Route path="/acupunctureLibrary" element={<AcupunctureLibrary/>}/>
        <Route path="/acupunctureShowPage" element={<AcupunctureShowPage/>}/>
        <Route path="/createMedicalRecord" element={<CreateMedicalRecord/>}/>
        <Route path="/medicalRecordDetail" element={<MedicalRecordDetail/>}/>
        <Route path="/suggest" element={<Suggest />} />
        <Route path="/illnessAcupunctureShow" element={<IllnessAcupunctureShow/>}/>
        <Route path="/createIllness" element={<CreateIllness/>} />
        <Route path="/meridianLibrary" element = {<MeridianLibrary/>}/>
        <Route path="/meridianAcupunctureShow" element={<MeridianAcupunctureShow/>}/>
        <Route path="/medicalRecordIllnessShowPage" element={<MedicalRecordIllnessShowPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
