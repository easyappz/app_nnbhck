import React from 'react';
import { Button, Card, Typography } from 'antd';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const Home = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }} data-easytag="id1-src/pages/Home.js">
      <Card style={{ maxWidth: 640, width: '100%' }} data-easytag="id2-src/pages/Home.js">
        <Title level={2} style={{ marginTop: 0 }}>Добро пожаловать!</Title>
        <Paragraph>
          Это демо-приложение с регистрацией, авторизацией и профилем пользователя.
        </Paragraph>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/login">
            <Button type="primary">Войти</Button>
          </Link>
          <Link to="/register">
            <Button>Регистрация</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Home;
