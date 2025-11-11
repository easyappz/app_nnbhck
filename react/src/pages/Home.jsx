import React from 'react';
import { Button, Card, Typography } from 'antd';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const Home = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }} data-easytag="id1-src/pages/Home.jsx">
      <Card style={{ maxWidth: 720, width: '100%' }} data-easytag="id2-src/pages/Home.jsx">
        <Title level={2} style={{ marginBottom: 12 }} data-easytag="id3-src/pages/Home.jsx">Добро пожаловать в Easyappz</Title>
        <Paragraph style={{ marginBottom: 0 }} data-easytag="id4-src/pages/Home.jsx">
          Это простое приложение с регистрацией, авторизацией и личным профилем. После входа вы сможете просматривать и редактировать информацию профиля.
        </Paragraph>
        <div style={{ display: 'flex', gap: 12, marginTop: 24 }} data-easytag="id5-src/pages/Home.jsx">
          <Link to="/register">
            <Button type="primary" size="large">Зарегистрироваться</Button>
          </Link>
          <Link to="/login">
            <Button size="large">Войти</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Home;
