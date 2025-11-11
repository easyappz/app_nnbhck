import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, DatePicker, Descriptions, Form, Input, Typography, message } from 'antd';
import dayjs from 'dayjs';
import { useAuth } from '../context/AuthContext';
import * as profileApi from '../api/profile';

const { Title } = Typography;

const Profile = () => {
  const { user, setUser } = useAuth();
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  const initialValues = useMemo(() => {
    if (!user) return {};
    return {
      email: user.email,
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      phone: user.profile?.phone || '',
      birth_date: user.profile?.birth_date ? dayjs(user.profile.birth_date) : null,
      about: user.profile?.about || '',
    };
  }, [user]);

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues, form]);

  const onFinish = async (values) => {
    setSaving(true);
    try {
      const payload = {
        first_name: values.first_name || '',
        last_name: values.last_name || '',
        profile: {
          phone: values.phone || '',
          birth_date: values.birth_date ? dayjs(values.birth_date).format('YYYY-MM-DD') : null,
          about: values.about || '',
        },
      };
      const updated = await profileApi.updateMe(payload, 'patch');
      setUser(updated);
      message.success('Профиль обновлён');
    } catch (error) {
      const data = error?.response?.data;
      if (data && typeof data === 'object') {
        const fields = [];
        Object.keys(data).forEach((key) => {
          const val = data[key];
          if (key === 'profile' && val && typeof val === 'object') {
            Object.keys(val).forEach((pkey) => {
              const pval = val[pkey];
              const msg = Array.isArray(pval) ? pval.join(', ') : String(pval);
              fields.push({ name: pkey, errors: [msg] });
            });
          } else {
            const msg = Array.isArray(val) ? val.join(', ') : String(val);
            fields.push({ name: key, errors: [msg] });
          }
        });
        if (fields.length) form.setFields(fields);
      }
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flexWrap: 'wrap' }} data-easytag="id1-src/pages/Profile.js">
      <Card style={{ flex: '1 1 360px', minWidth: 320 }} data-easytag="id2-src/pages/Profile.js">
        <Title level={4} style={{ marginTop: 0 }}>Общая информация</Title>
        <Descriptions column={1} size="small" bordered>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Имя и фамилия">{[user.first_name, user.last_name].filter(Boolean).join(' ') || '—'}</Descriptions.Item>
          <Descriptions.Item label="Телефон">{user.profile?.phone || '—'}</Descriptions.Item>
          <Descriptions.Item label="Дата рождения">{user.profile?.birth_date ? dayjs(user.profile.birth_date).format('DD.MM.YYYY') : '—'}</Descriptions.Item>
          <Descriptions.Item label="О себе">{user.profile?.about || '—'}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card style={{ flex: '1 1 420px', minWidth: 360 }} data-easytag="id3-src/pages/Profile.js">
        <Title level={4} style={{ marginTop: 0 }}>Редактировать профиль</Title>
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={initialValues}>
          <Form.Item name="email" label="Email">
            <Input disabled />
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
            <Input.TextArea rows={4} placeholder="Расскажите о себе" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={saving} disabled={saving}>
              Сохранить
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Profile;
