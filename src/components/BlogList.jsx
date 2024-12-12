import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import BlogCard from './BlogCard';
import EditModal from './EditModal';

const Container = styled.div`
  margin-top: 40px;
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  padding: 20px;
  text-align: center;
`;

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [editingPost, setEditingPost] = useState(null);

  const fetchPosts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'blog-posts'));
      const postsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsData);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load blog posts');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    try {
      await deleteDoc(doc(db, 'blog-posts', postId));
      await fetchPosts(); // Refresh the list
    } catch (err) {
      console.error('Error deleting post:', err);
      setError('Failed to delete post');
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
  };

  const handleSave = async (updatedPost) => {
    try {
      await updateDoc(doc(db, 'blog-posts', updatedPost.id), updatedPost);
      setEditingPost(null);
      await fetchPosts(); // Refresh the list
    } catch (err) {
      console.error('Error updating post:', err);
      setError('Failed to update post');
    }
  };

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <Container>
      {posts.map(post => (
        <BlogCard
          key={post.id}
          post={post}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}

      {editingPost && (
        <EditModal
          post={editingPost}
          onSave={handleSave}
          onClose={() => setEditingPost(null)}
        />
      )}
    </Container>
  );
};

export default BlogList; 