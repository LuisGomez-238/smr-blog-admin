import React from 'react';
import styled from '@emotion/styled';
import BlogForm from './components/BlogForm';
import BlogList from './components/BlogList';
import Login from './components/Login';
import { useAuth } from './context/AuthContext';
import { auth } from './services/firebase';
import { signOut } from 'firebase/auth';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  color: #333;
`;

const LogoutButton = styled.button`
  background-color: #ff4444;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #cc0000;
  }
`;

const App = () => {
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    return <Login />;
  }

  return (
    <Container>
      <Header>
        <Title>Blog Post Manager</Title>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Header>
      <BlogForm />
      <BlogList />
    </Container>
  );
};

export default App; 