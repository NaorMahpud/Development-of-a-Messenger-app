import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import Groups from './Groups';
import MessageHistory from './MessageHistory';
import SendMessage from './SendMessage';
import CreateGroup from './CreateGroup';
import BlockUser from './BlockUser';
import Registration from './Register';
import withAuth from './WithAuth';

const DashboardWithAuth = withAuth(Dashboard)

function App() {

  return (

    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/signup' element={<Registration />} />
        <Route path='/dashboard' element={<DashboardWithAuth />}>
          <Route path='send-message' element={<SendMessage />} />
          <Route path='groups' element={<Groups />} />
          <Route path='creategroup' element={<CreateGroup />} />

          <Route path='blocks' element={<BlockUser />} />
          <Route path='message-history' element={<MessageHistory />} />

        </Route>

      </Routes>
    </Router>

  )
}

export default App
