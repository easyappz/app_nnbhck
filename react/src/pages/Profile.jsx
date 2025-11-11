import React from 'react';
import { Card, Descriptions, Spin, Typography } from 'antd';
import { useAuth } from '../context/AuthContext';

const { Title } = Typography;

const Profile = () => {
  const { user, accessToken } = useAuth();

  if (accessToken && !user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }} data-easytag="id1-src/pages/Profile.jsx">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }} data-easytag="id2-src/pages/Profile.jsx">
      <Card style={{ maxWidth: 720, width: '100%' }} data-easytag="id3-src/pages/Profile.jsx">
        <Title level={3} style={{ marginBottom: 16 }} data-easytag="id4-src/pages/Profile.jsx">Профиль</Title>
        {user ? (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
            <Descriptions.Item label="Имя и фамилия">{[user.first_name, user.last_name].filter(Boolean).join(' ') || '—'}</Descriptions.Item>
            <Descriptions.Item label="Телефон">{user.profile?.phone || '—'}</Descriptions.Item>
            <Descriptions.Item label="Дата рождения">{user.profile?.birth_date || '—'}</Descriptions.Item>
            <Descriptions.Item label="О себе">{user.profile?.about || '—'}</Descriptions.Item>
          </Descriptions>
        ) : (
          <div>Нет данных профиля</div>
        )}
      </Card>
    </div>
  );
};

export default Profile;
