/* eslint-disable import/order */
import { Route, Routes } from 'react-router-dom';

import Login from './Pages/Login';
import NewAccount from './Pages/NewAccount';
import Timeline from './Pages/TimeLine';

import './App.css';

import AccountSettings from 'Pages/AccountSettings';
import MessageView from 'Pages/Chats/MessageView';
import ForgotPassword from 'Pages/ForgotPassword';
import ResetPassword from 'Pages/ResetPassword';
import PrivateRoute from 'RouteController/PrivateRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/newaccount" element={<NewAccount />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/resetPassword" element={<ResetPassword />} />
      <Route element={<PrivateRoute />}>
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/messages" element={<MessageView />} />
        <Route path="/account-settings" element={<AccountSettings />} />
      </Route>
    </Routes>
  );
}

export default App;
