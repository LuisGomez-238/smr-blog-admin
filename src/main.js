import './style.css';
import { db } from './firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { s3Client, BUCKET_NAME, BUCKET_REGION } from './aws-config';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const blogForm = document.getElementById('blogForm');
const postsContainer = document.getElementById('posts');

// Function to upload file to S3
async function uploadToS3(file) {
  try {
    const fileName = `${Date.now()}-${file.name}`;
    const key = `blog-images/${fileName}`;

    // Create the command
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: file.type
    });

    // Generate pre-signed URL
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });

    // Upload using fetch and pre-signed URL
    const response = await fetch(signedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    // Return the public URL of the uploaded image
    return `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/${key}`;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw error;
  }
}

// Function to handle form submission
async function handleSubmit(e) {
  e.preventDefault();
  
  const formData = {
    title: document.getElementById('title').value,
    subtitle: document.getElementById('subtitle').value,
    content: document.getElementById('content').value,
    author: document.getElementById('author').value,
    category: document.getElementById('category').value,
    date: new Date().toISOString(),
  };

  const imageFile = document.getElementById('image').files[0];
  
  try {
    // Upload image to S3 and get URL
    const imageUrl = await uploadToS3(imageFile);
    
    // Add blog post to Firestore
    const docRef = await addDoc(collection(db, 'blog-posts'), {
      ...formData,
      imageUrl,
    });

    alert('Blog post created successfully!');
    blogForm.reset();
    loadPosts();
  } catch (error) {
    console.error('Error creating blog post:', error);
    alert('Error creating blog post');
  }
}

// Function to load and display posts
async function loadPosts() {
  try {
    const querySnapshot = await getDocs(collection(db, 'blog-posts'));
    postsContainer.innerHTML = '';
    
    querySnapshot.forEach((doc) => {
      const post = doc.data();
      const postElement = document.createElement('div');
      postElement.className = 'post-card';
      postElement.innerHTML = `
        <img src="${post.imageUrl}" alt="${post.title}" class="post-image">
        <h2>${post.title}</h2>
        <h3>${post.subtitle}</h3>
        <p><strong>Author:</strong> ${post.author}</p>
        <p><strong>Category:</strong> ${post.category}</p>
        <p><strong>Date:</strong> ${new Date(post.date).toLocaleDateString()}</p>
        <p>${post.content}</p>
      `;
      postsContainer.appendChild(postElement);
    });
  } catch (error) {
    console.error('Error loading posts:', error);
  }
}

// Event listeners
blogForm.addEventListener('submit', handleSubmit);

// Load posts when the page loads
loadPosts();