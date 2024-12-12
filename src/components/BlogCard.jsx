import React from 'react';
import styled from '@emotion/styled';

const Card = styled.div`
  position: relative;
  border: 1px solid #ddd;
  padding: 15px;
  margin: 10px 0;
  border-radius: 4px;
`;

const Actions = styled.div`
  position: absolute;
  top: 10px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
`;

const Button = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: background-color 0.2s;
`;

const EditButton = styled(Button)`
  background-color: #2196F3;
  &:hover {
    background-color: #1976D2;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #ff4444;
  &:hover {
    background-color: #cc0000;
  }
`;

const Image = styled.img`
  max-width: 200px;
  height: auto;
  margin-bottom: 10px;
`;

const Content = styled.div`
  p {
    margin-bottom: 1em;
  }
  
  a {
    color: #2196F3;
    text-decoration: none;
    transition: color 0.2s;
    
    &:hover {
      color: #1976D2;
      text-decoration: underline;
    }
    
    &:visited {
      color: #7E57C2;
    }
  }
`;

const BlogCard = ({ post, onEdit, onDelete }) => {
  return (
    <Card>
      <Actions>
        <EditButton onClick={() => onEdit(post)} aria-label="Edit post">✎</EditButton>
        <DeleteButton 
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this post?')) {
              onDelete(post.id);
            }
          }} 
          aria-label="Delete post"
        >
          ×
        </DeleteButton>
      </Actions>
      <Image src={post.imageUrl} alt={post.title} />
      <h2>{post.title}</h2>
      <h3>{post.subtitle}</h3>
      <p><strong>Author:</strong> {post.author}</p>
      <p><strong>Category:</strong> {post.category}</p>
      <p><strong>Date:</strong> {new Date(post.date).toLocaleDateString()}</p>
      <Content 
        dangerouslySetInnerHTML={{ 
          __html: post.content.replace(
            /(https?:\/\/[^\s]+)/g, 
            '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
          )
        }} 
      />
    </Card>
  );
};

export default BlogCard; 