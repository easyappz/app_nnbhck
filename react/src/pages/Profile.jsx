import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, DatePicker, Form, Input, Typography, message, Spin } from 'antd';
import dayjs from 'dayjs';
import { useAuth } from '../context/AuthContext';
import { updateMe } from '../api/profile';

const { Title } = Typography;
const { TextArea } = Input;

const Profile = () => {
  const { user, setUser, initTried } = useAuth();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  const loading = useMemo(() => !initTried || !user, [initTried, user]);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        profile: {
          phone: user.profile?.phone || '',
          birth_date: user.profile?.birth_date ? dayjs(user.profile.birth_date) : null,
          about: user.profile?.about || '',
        },
      });
    }
  }, [user, form]);

  const onFinish = async (values) => {
    const payload = {
      first_name: values.first_name || '',
      last_name: values.last_name || '',
      profile: {
        phone: values?.profile?.phone || '',
        birth_date: values?.profile?.birth_date ? dayjs(values.profile.birth_date).format('YYYY-MM-DD') : null,
        about: values?.profile?.about || '',
      },
    };

    setSaving(true);
    try {
      const updated = await updateMe(payload, 'patch');
      setUser(updated);
      message.success('Профиль обновлён');
    } catch (e) {
      const detail = e?.response?.data?.detail || 'Не удалось сохранить профиль';
      message.error(detail);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }} data-easytag="id1-src/pages/Profile.jsx">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }} data-easytag="id2-src/pages/Profile.jsx">
      <Card style={{ maxWidth: 720, width: '100%' }} data-easytag="id3-src/pages/Profile.jsx">
        <Title level={3} style={{ marginBottom: 16, textAlign: 'center' }} data-easytag="id4-src/pages/Profile.jsx">Профиль</Title>
        <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={false} data-easytag="id5-src/pages/Profile.jsx">
          <Form.Item name="email" label="Email">
            <Input disabled />
          </Form.Item>

          <Form.Item name="first_name" label="Имя">
            <Input placeholder="Иван" />
          </Form.Item>

          <Form.Item name="last_name" label="Фамилия">
            <Input placeholder="Иванов" />
          </Form.Item>

          <Form.Item name={["profile", "phone"]} label="Телефон">
            <Input placeholder="+7 900 000-00-00" />
          </Form.Item>

          <Form.Item name={["profile", "birth_date"]} label="Дата рождения">
            <DatePicker style={{ width: '100%' }} placeholder="Выберите дату" format="DD.MM.YYYY" />
          </Form.Item>

          <Form.Item name={["profile", "about"]} label="О себе">
            <TextArea rows={4} placeholder="Коротко о себе" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={saving} block>Сохранить</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Profile;
