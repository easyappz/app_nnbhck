import React, { useState } from 'react';
import { Button, Card, DatePicker, Form, Input, Typography } from 'antd';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;

const Register = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { register, authLoading } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        email: values.email,
        password: values.password,
        first_name: values.first_name || '',
        last_name: values.last_name || '',
        phone: values.phone || '',
        birth_date: values.birth_date ? dayjs(values.birth_date).format('YYYY-MM-DD') : null,
        about: values.about || '',
      };
      await register(payload);
      navigate('/profile', { replace: true });
    } catch (error) {
      const data = error?.response?.data;
      if (data && typeof data === 'object') {
        const fields = Object.keys(data).map((key) => {
          const val = data[key];
          const msg = Array.isArray(val) ? val.join(', ') : String(val);
          const mappedName = key === 'detail' || key === 'non_field_errors' ? 'email' : key;
          return { name: mappedName, errors: [msg] };
        });
        if (fields.length) form.setFields(fields);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }} data-easytag="id1-src/pages/Register.js">
      <Card style={{ width: 620 }} data-easytag="id2-src/pages/Register.js">
        <Title level={3} style={{ marginTop: 0 }}>Регистрация</Title>
        <Form form={form} layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Введите email' }, { type: 'email', message: 'Некорректный email' }]}>
            <Input placeholder="Введите email" autoComplete="email" />
          </Form.Item>
          <Form.Item name="password" label="Пароль" rules={[{ required: true, message: 'Введите пароль' }, { min: 8, message: 'Минимум 8 символов' }]}>
            <Input.Password placeholder="Введите пароль" autoComplete="new-password" />
          </Form.Item>
          <Form.Item name="first_name" label="Имя">
            <Input placeholder="Имя" />
          </Form.Item>
          <Form.Item name="last_name" label="Фамилия">
            <Input placeholder="Фамилия" />
          </Form.Item>
          <Form.Item name="phone" label="Телефон">
            <Input placeholder="Телефон" />
          </Form.Item>
          <Form.Item name="birth_date" label="Дата рождения">
            <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" />
          </Form.Item>
          <Form.Item name="about" label="О себе">
            <Input.TextArea placeholder="Расскажите о себе" rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting || authLoading} disabled={submitting || authLoading} block>
              Зарегистрироваться
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
