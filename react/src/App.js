import React, { useMemo } from 'react';
import { Layout, Menu, message } from 'antd';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import './App.css';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

const { Header, Content, Footer } = Layout;

function App() {
  const { user, accessToken, logout } = useAuth();
  const isAuth = Boolean(user || accessToken);
  const location = useLocation();
  const navigate = useNavigate();

  const selectedKey = useMemo(() => {
    if (location.pathname === '/') return 'home';
    if (location.pathname.startsWith('/profile')) return 'profile';
    if (location.pathname.startsWith('/login')) return 'login';
    if (location.pathname.startsWith('/register')) return 'register';
    return 'home';
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    message.success('Вы вышли из аккаунта');
    navigate('/');
  };

  const menuItems = useMemo(() => {
    const items = [
      { key: 'home', label: <Link to="/">Главная</Link> },
      { key: 'profile', label: <Link to="/profile">Профиль</Link> },
    ];

    if (isAuth) {
      items.push({ key: 'logout', label: <span onClick={handleLogout}>Выйти</span> });
    } else {
      items.push(
        { key: 'login', label: <Link to="/login">Войти</Link> },
        { key: 'register', label: <Link to="/register">Регистрация</Link> },
      );
    }

    return items;
  }, [isAuth]);

  return (
    <ErrorBoundary>
      <Layout style={{ minHeight: '100vh' }} data-easytag="id1-src/App.js">
        <Header style={{ display: 'flex', alignItems: 'center' }} data-easytag="id2-src/App.js">
          <div style={{ color: '#fff', fontWeight: 600, marginRight: 24 }} data-easytag="id3-src/App.js">Easyappz</div>
          <Menu
            theme="dark"
            mode="horizontal"
            selectedKeys={[selectedKey]}
            items={menuItems}
            style={{ flex: 1 }}
          />
        </Header>
        <Content style={{ padding: '24px', maxWidth: 1200, margin: '0 auto', width: '100%' }} data-easytag="id4-src/App.js">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Content>
        <Footer style={{ textAlign: 'center' }} data-easytag="id5-src/App.js">
          © {new Date().getFullYear()} Easyappz
        </Footer>
      </Layout>
    </ErrorBoundary>
  );
}

export default App;
