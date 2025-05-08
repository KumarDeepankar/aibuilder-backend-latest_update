import React, { useState } from 'react';
import styled from 'styled-components';
import Modal from './Modal';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ModalContainer = styled.div`
  padding: 2rem;
`;

const ModalHeader = styled.div`
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1c1f26;
  margin: 0 0 0.5rem 0;
`;

const ModalSubtitle = styled.p`
  color: #666;
  margin: 0;
  font-size: 0.9rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.9rem;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d1d1;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #5654a2;
    box-shadow: 0 0 0 2px rgba(86, 84, 162, 0.2);
  }
  
  &::placeholder {
    color: #999;
    font-size: 0.9rem;
  }
`;

const ForgotPassword = styled.a`
  font-size: 0.85rem;
  color: #5654a2;
  text-align: right;
  text-decoration: none;
  display: block;
  margin-top: 0.5rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const Button = styled.button`
  background-color: #5654a2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover, &:focus {
    background-color: #474593;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(86, 84, 162, 0.4);
  }
  
  &:disabled {
    background-color: #a0a0a0;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  
  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: #e0e0e0;
  }
  
  span {
    padding: 0 1rem;
    color: #666;
    font-size: 0.85rem;
  }
`;

const SocialLoginButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: ${props => props.bgColor || 'white'};
  color: ${props => props.textColor || '#333'};
  border: 1px solid #d1d1d1;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  
  svg {
    margin-right: 0.75rem;
  }
  
  &:hover {
    background-color: ${props => props.hoverBgColor || '#f5f5f5'};
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(86, 84, 162, 0.2);
  }
`;

const SignUpText = styled.div`
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: #666;
  
  a {
    color: #5654a2;
    font-weight: 500;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  color: #e53935;
  font-size: 0.85rem;
  margin-top: 0.5rem;
`;

const HelpText = styled.div`
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #666;
  background-color: #f5f5f5;
  padding: 0.75rem;
  border-radius: 4px;
  border-left: 3px solid #5654a2;
`;

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  
  // Form validation
  const isFormValid = email.trim() !== '' && password.trim() !== '';
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isFormValid) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      await login(email, password);
      setIsLoading(false);
      onClose(); // Close the modal after successful login
      navigate('/dashboard'); // Redirect to dashboard
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
    }
  };
  
  const handleSocialLogin = (provider) => {
    console.log(`Logging in with ${provider}`);
    // In a real app, this would use OAuth with the specified provider
  };
  
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      ariaLabel="Login dialog"
      maxWidth="400px"
    >
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>Welcome back</ModalTitle>
          <ModalSubtitle>Sign in to access your AI Builder account</ModalSubtitle>
        </ModalHeader>
        
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <ForgotPassword href="#forgot-password">Forgot password?</ForgotPassword>
          </FormGroup>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <HelpText>
            <strong>Demo credentials:</strong><br />
            Email: demo@aibuilder.com<br />
            Password: builder123
          </HelpText>
          
          <Button 
            type="submit" 
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </Form>
        
        <Divider>
          <span>OR</span>
        </Divider>
        
        <SocialLoginButton 
          type="button"
          bgColor="#4285F4"
          textColor="white"
          hoverBgColor="#3367D6"
          onClick={() => handleSocialLogin('Google')}
        >
          <GoogleIcon />
          Continue with Google
        </SocialLoginButton>
        
        <SocialLoginButton 
          type="button"
          onClick={() => handleSocialLogin('Github')}
        >
          <GithubIcon />
          Continue with GitHub
        </SocialLoginButton>
        
        <SignUpText>
          Don't have an account? <a href="#signup">Sign up</a>
        </SignUpText>
      </ModalContainer>
    </Modal>
  );
};

// Social login icons
const GoogleIcon = () => (
  <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
  </svg>
);

const GithubIcon = () => (
  <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
);

export default LoginModal;