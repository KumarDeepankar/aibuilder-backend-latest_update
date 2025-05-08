import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import SimpleHeader from '../components/common/SimpleHeader';

// Page layout - split screen
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
`;

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
`;

// Left side - forgot password form
const FormContainer = styled.div`
  flex: 1;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: white;
  color: #333;
  
  @media (max-width: 992px) {
    width: 100%;
    padding: 2rem;
  }
`;

const FormWrapper = styled.div`
  width: 100%;
  max-width: 420px;
`;

const BackLink = styled(Link)`
  display: flex;
  align-items: center;
  color: #6c757d;
  text-decoration: none;
  font-size: 1rem;
  margin-bottom: 2rem;
  
  &:hover {
    color: #3B82F6;
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

const FormHeader = styled.div`
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: #1c1f26;
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  color: #6c757d;
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
`;

const Form = styled.form`
  width: 100%;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  
  &:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ResetButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: #3B82F6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 1.5rem;
  
  &:hover {
    background-color: #2563EB;
  }
  
  &:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
  }
`;

const HelpText = styled.div`
  text-align: center;
  margin-top: 2rem;
  font-size: 0.95rem;
  color: #6c757d;
  display: flex;
  justify-content: center;
  align-items: center;
  
  span {
    margin-right: 0.5rem;
  }
  
  a {
    color: #3B82F6;
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

// Right side - image/design
const ImageContainer = styled.div`
  flex: 1;
  background-color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 992px) {
    display: none; // Hide on mobile/tablet
  }
`;

const PlaceholderImage = styled.div`
  width: 320px;
  height: 600px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  position: relative;
  
  &::before {
    content: "Phone Mockup";
    font-size: 1rem;
    opacity: 0.7;
    margin-bottom: 1rem;
  }
  
  &::after {
    content: "";
    width: 60%;
    height: 60%;
    border: 2px dashed rgba(255, 255, 255, 0.3);
    border-radius: 12px;
  }
`;

const PhoneImage = styled.div`
  position: relative;
  width: 280px;
  height: 580px;
  
  img {
    width: 100%;
    height: auto;
  }
`;

const Phone = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #FF00CC, #3333FF);
  border-radius: 30px;
  overflow: hidden;
  border: 8px solid #222;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);

  &:before {
    content: '';
    position: absolute;
    top: 0;
    width: 50%;
    height: 30px;
    background-color: #222;
    left: 25%;
    border-bottom-left-radius: 15px;
    border-bottom-right-radius: 15px;
  }
`;

const PhoneContent = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #FF6B6B, #FF8E53);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: white;
`;

const CodeSnippet = styled.div`
  position: absolute;
  right: 18%;
  top: 50%;
  transform: translateY(-50%);
  width: 40%;
  height: 70%;
  opacity: 0.8;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #64FFDA;
  font-family: monospace;
  font-size: 12px;
  line-height: 1.4;
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 20%, rgba(0,0,0,0.7) 80%, rgba(0,0,0,1) 100%);
    pointer-events: none;
    z-index: 1;
  }
`;

// SVG Icons
const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // In a real application, this would be a call to your backend to send a reset email
      console.log(`Password reset requested for: ${email}`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSuccess(true);
      // You could redirect to a confirmation page or stay on the same page with a success message
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageContainer>
      <SimpleHeader />
      <ContentContainer>
        <FormContainer>
          <FormWrapper>
            <BackLink to="/signin">
              <ArrowLeftIcon /> Back to Sign In
            </BackLink>
            
            <FormHeader>
              <Title>Reset your password</Title>
              <Subtitle>
                Enter your email address and we'll send you instructions to reset your password.
              </Subtitle>
            </FormHeader>
            
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="email">Email address</Label>
                <Input 
                  type="email" 
                  id="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required 
                />
              </FormGroup>
              
              {error && <p style={{ color: '#dc3545', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</p>}
              
              {isSuccess && (
                <p style={{ color: '#28a745', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  Reset instructions sent! Please check your email.
                </p>
              )}
              
              <ResetButton type="submit" disabled={isLoading || isSuccess}>
                {isLoading ? 'Sending...' : isSuccess ? 'Email Sent' : 'Send Reset Instructions'}
              </ResetButton>
            </Form>
            
            <HelpText>
              <span>Need additional help?</span>
              <Link to="/signin">Sign in</Link>
            </HelpText>
          </FormWrapper>
        </FormContainer>
        
        <ImageContainer>
          <PlaceholderImage />
          
        </ImageContainer>
      </ContentContainer>
    </PageContainer>
  );
};

export default ForgotPassword;