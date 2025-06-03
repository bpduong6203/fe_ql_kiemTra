import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './page/dashboard/homepage';
import Login from './page/auth/login';
import Register from './page/auth/register';
import ForbiddenPage from './page/error/403';
import KeHoach from './page/views/keHoach';
import DonVi from './page/views/donVi';
import NguoiDung from './page/views/nguoiDung';
import { ToastProvider } from './components/toast-provider';
import KeHoachDetails from './page/views/keHoachDetail';
import { SelectedPlanProvider } from './context/SelectedPlanContext';
import { AuthProvider } from './context/AuthContext';
import PhanCong from './page/views/phanCong';
import Appearance from './page/settings/appearance';
import Profile from './page/settings/profile';
import Password from './page/settings/password';

const App = () => {
  console.log('Rendering App.tsx');

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastProvider>
        <AuthProvider>
          <SelectedPlanProvider>
            <Routes>
              <Route path="/home" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Navigate to="/home" replace />} />
              <Route path="/403"  element={<ForbiddenPage />} />
              <Route path="*"     element={<ForbiddenPage />} />

              <Route path="/ke_hoach" element={<KeHoach />} />
              <Route path='/don_vi' element={<DonVi />} />
              <Route path='/nguoi_dung' element={<NguoiDung />} />
              <Route path='/chi_tiet_ke_hoach' element={<KeHoachDetails />} />
              <Route path='/phan_cong' element={<PhanCong />} />
              <Route path='/settings/appearance' element={<Appearance />} />
              <Route path='/settings/profile' element={<Profile />} />
              <Route path='/settings/password' element={<Password />} />
            </Routes>          
          </SelectedPlanProvider>
        </AuthProvider>
      </ToastProvider>

    </div>
  );
};

export default App;