import React, { useState } from 'react';
import { Button, Card, Form, Input, Typography } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;

const Login = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, authLoading } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/profile';

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      await login(values.email, values.password);
      navigate(from, { replace: true });
    } catch (error) {
      const data = error?.response?.data;
      if (data && typeof data === 'object') {
        const fields = [];
        Object.keys(data).forEach((key) => {
          const val = data[key];
          let msg = Array.isArray(val) ? val.join(', ') : String(val);
          // Map common keys to form fields if possible
          if (key === 'email' || key === 'password' || key === 'non_field_errors' || key === 'detail') {
            fields.push({ name: key === 'non_field_errors' || key === 'detail' ? 'email' : key, errors: [msg] });
          }
        });
        if (fields.length) form.setFields(fields);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }} data-easytag="id1-src/pages/Login.js">
      <Card style={{ width: 420 }} data-easytag="id2-src/pages/Login.js">
        <Title level={3} style={{ marginTop: 0 }}>Вход</Title>
        <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Введите email' }, { type: 'email', message: 'Некорректный email' }]}>
            <Input placeholder="Введите email" autoComplete="email" />
          </Form.Item>
          <Form.Item name="password" label="Пароль" rules={[{ required: true, message: 'Введите пароль' }]}>
            <Input.Password placeholder="Введите пароль" autoComplete="current-password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting || authLoading} disabled={submitting || authLoading} block>
              Войти
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
