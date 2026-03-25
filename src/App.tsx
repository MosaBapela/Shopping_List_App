import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';

import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import HomePage from './pages/HomePage/HomePage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import SharedListPage from './pages/SharedListPage/SharedListPage';
import './App.css';
import ProtectedRoute from './componets/ProtectedRoute/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/shared/:shareToken" element={<SharedListPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;

