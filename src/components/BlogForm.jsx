import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useS3Upload } from '../hooks/useS3Upload';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import imageCompression from 'browser-image-compression';

const Form = styled.form`
  margin-bottom: 40px;
`;

const FormGroup = styled.div`
  margin-bottom: 25px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  min-height: 200px;
  resize: vertical;
  line-height: 1.5;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const SubmitButton = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    background-color: #45a049;
  }
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  margin-top: 10px;
`;

const CompressionStatus = styled.div`
  color: #2196F3;
  font-size: 14px;
  margin-top: 5px;
`;

const BlogForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    content: '',
    author: '',
    category: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [compressionStatus, setCompressionStatus] = useState('');
  const { uploadFile, isUploading, error: uploadError } = useS3Upload();

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 0.2, // 200KB
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      onProgress: (progress) => {
        setCompressionStatus(`Compressing: ${Math.round(progress)}%`);
      }
    };

    try {
      const compressedFile = await imageCompression(file, options);
      console.log('Original file size:', file.size / 1024 / 1024, 'MB');
      console.log('Compressed file size:', compressedFile.size / 1024 / 1024, 'MB');
      return compressedFile;
    } catch (error) {
      console.error('Error compressing image:', error);
      throw new Error('Failed to compress image');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = async (e) => {
    if (e.target.files[0]) {
      try {
        setCompressionStatus('Starting compression...');
        const compressed = await compressImage(e.target.files[0]);
        setImageFile(compressed);
        setCompressionStatus('');
      } catch (error) {
        setCompressionStatus('Compression failed');
        console.error('Error handling image:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!imageFile) {
        throw new Error('Please select an image');
      }

      const imageUrl = await uploadFile(imageFile);
      
      await addDoc(collection(db, 'blog-posts'), {
        ...formData,
        imageUrl,
        date: new Date().toISOString()
      });

      // Reset form
      setFormData({
        title: '',
        subtitle: '',
        content: '',
        author: '',
        category: '',
      });
      setImageFile(null);
      setCompressionStatus('');
      e.target.reset();
      alert('Blog post created successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error creating blog post');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="image">Image:</Label>
        <Input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
          required
        />
        {compressionStatus && (
          <CompressionStatus>{compressionStatus}</CompressionStatus>
        )}
      </FormGroup>

      <FormGroup>
        <Label htmlFor="title">Title:</Label>
        <Input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="subtitle">Subtitle:</Label>
        <Input
          type="text"
          id="subtitle"
          name="subtitle"
          value={formData.subtitle}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="content">Content:</Label>
        <TextArea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="author">Author:</Label>
        <Input
          type="text"
          id="author"
          name="author"
          value={formData.author}
          onChange={handleChange}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="category">Category:</Label>
        <Input
          type="text"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        />
      </FormGroup>

      {uploadError && <ErrorMessage>{uploadError}</ErrorMessage>}

      <SubmitButton 
        type="submit" 
        disabled={isUploading || !!compressionStatus}
      >
        {isUploading ? 'Uploading...' : 'Create Post'}
      </SubmitButton>
    </Form>
  );
};

export default BlogForm; 