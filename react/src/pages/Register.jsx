import React, { useState } from 'react';
import { Button, Card, DatePicker, Form, Input, Typography, message } from 'antd';
import dayjs from 'dayjs';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;
const { TextArea } = Input;

const Register = () => {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const payload = {
      email: values.email,
      password: values.password,
      first_name: values.first_name || '',
      last_name: values.last_name || '',
      phone: values.phone || '',
      birth_date: values.birth_date ? dayjs(values.birth_date).format('YYYY-MM-DD') : null,
      about: values.about || '',
    };

    setLoading(true);
    try {
      await register(payload);
      navigate('/profile', { replace: true });
    } catch (e) {
      const detail = e?.response?.data?.detail || 'Не удалось зарегистрироваться. Попробуйте ещё раз.';
      message.error(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }} data-easytag="id1-src/pages/Register.jsx">
      <Card style={{ maxWidth: 720, width: '100%' }} data-easytag="id2-src/pages/Register.jsx">
        <Title level={3} style={{ textAlign: 'center' }} data-easytag="id3-src/pages/Register.jsx">Регистрация</Title>
        <Form layout="vertical" onFinish={onFinish} requiredMark={false} data-easytag="id4-src/pages/Register.jsx">
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Введите email' }, { type: 'email', message: 'Некорректный email' }]}>
            <Input placeholder="example@mail.com" autoComplete="email" />
          </Form.Item>

          <Form.Item name="password" label="Пароль" rules={[{ required: true, message: 'Введите пароль' }, { min: 8, message: 'Минимум 8 символов' }]} hasFeedback>
            <Input.Password placeholder="Придумайте пароль" autoComplete="new-password" />
          </Form.Item>

          <Form.Item name="confirm" label="Подтверждение пароля" dependencies={['password']} hasFeedback rules={[
            { required: true, message: 'Подтвердите пароль' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Пароли не совпадают'));
              },
            }),
          ]}>
            <Input.Password placeholder="Повторите пароль" autoComplete="new-password" />
          </Form.Item>

          <Form.Item name="first_name" label="Имя">
            <Input placeholder="Иван" />
          </Form.Item>

          <Form.Item name="last_name" label="Фамилия">
            <Input placeholder="Иванов" />
          </Form.Item>

          <Form.Item name="phone" label="Телефон">
            <Input placeholder="+7 900 000-00-00" />
          </Form.Item>

          <Form.Item name="birth_date" label="Дата рождения">
            <DatePicker style={{ width: '100%' }} placeholder="Выберите дату" format="DD.MM.YYYY" />
          </Form.Item>

          <Form.Item name="about" label="О себе">
            <TextArea rows={4} placeholder="Коротко о себе" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>Зарегистрироваться</Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }} data-easytag="id5-src/pages/Register.jsx">
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
