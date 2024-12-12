import React from 'react';
import styled from '@emotion/styled';

const ModalOverlay = styled.div`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  width: 95%;
  max-width: 800px;
  max-height: 95vh;
  overflow-y: auto;
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
  min-height: 400px;
  resize: vertical;
  line-height: 1.5;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
  justify-content: flex-end;
  margin-top: 30px;
`;

const Button = styled.button`
  padding: 12px 30px;
  font-size: 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
`;

const SaveButton = styled(Button)`
  background-color: #4CAF50;
  &:hover {
    background-color: #45a049;
  }
`;

const CancelButton = styled(Button)`
  background-color: #757575;
  &:hover {
    background-color: #616161;
  }
`;

const EditModal = ({ post, onSave, onClose }) => {
  const [formData, setFormData] = React.useState(post);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <h3>Edit Post</h3>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="title">Title:</Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
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
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="content">Content:</Label>
            <TextArea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
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
            />
          </FormGroup>

          <ButtonGroup>
            <SaveButton type="submit">Save Changes</SaveButton>
            <CancelButton type="button" onClick={onClose}>Cancel</CancelButton>
          </ButtonGroup>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default EditModal; 