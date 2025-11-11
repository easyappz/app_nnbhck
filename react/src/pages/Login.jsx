import React, { useState } from 'react';
import { Button, Card, Form, Input, Typography, message } from 'antd';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/profile';

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      navigate(from, { replace: true });
    } catch (e) {
      const detail = e?.response?.data?.detail || 'Не удалось войти. Проверьте данные.';
      message.error(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }} data-easytag="id1-src/pages/Login.jsx">
      <Card style={{ maxWidth: 520, width: '100%' }} data-easytag="id2-src/pages/Login.jsx">
        <Title level={3} style={{ textAlign: 'center' }} data-easytag="id3-src/pages/Login.jsx">Вход</Title>
        <Form layout="vertical" onFinish={onFinish} requiredMark={false} data-easytag="id4-src/pages/Login.jsx">
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Введите email' }, { type: 'email', message: 'Некорректный email' }]}>
            <Input placeholder="example@mail.com" autoComplete="email" />
          </Form.Item>
          <Form.Item name="password" label="Пароль" rules={[{ required: true, message: 'Введите пароль' }]}>
            <Input.Password placeholder="Ваш пароль" autoComplete="current-password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>Войти</Button>
          </Form.Item>
          <div style={{ textAlign: 'center' }} data-easytag="id5-src/pages/Login.jsx">
            Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
