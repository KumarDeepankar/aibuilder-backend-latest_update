import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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

// Left side - sign up form
const SignUpContainer = styled.div`
  flex: 1;
  padding: 2.5rem;
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

const SignUpForm = styled.div`
  width: 100%;
  max-width: 420px;
`;

const SignUpHeader = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: #1c1f26;
  margin-bottom: 0.75rem;
`;

const Subtitle = styled.p`
  color: #6c757d;
  font-size: 1.1rem;
  margin: 0;
`;

const Form = styled.form`
  width: 100%;
`;

const SocialButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
`;

const SocialButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  border: 1px solid #e1e4e8;
  background-color: white;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #f8f9fa;
  }
  
  svg {
    margin-right: 0.75rem;
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
    color: #6c757d;
    font-size: 0.9rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.25rem;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 1.25rem;
  }
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

const PasswordRequirement = styled.p`
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #6c757d;
`;

const TermsContainer = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1.5rem;
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
  margin-top: 0.25rem;
  cursor: pointer;
`;

const TermsText = styled.label`
  font-size: 0.9rem;
  color: #333;
  
  a {
    color: #3B82F6;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const SignUpButton = styled.button`
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

const SignInPrompt = styled.div`
  text-align: center;
  margin-top: 1rem;
  font-size: 0.95rem;
  color: #6c757d;
  
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
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 2px;
    height: 80%;
    background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.7), transparent);
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
  right: 15%;
  top: 50%;
  transform: translateY(-50%);
  width: 40%;
  height: 70%;
  opacity: 0.7;
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

const CodeContent = styled.pre`
  position: relative;
  z-index: 0;
  margin: 0;
  padding: 20px;
`;

// SVG Icons
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" fill="#FFC107"/>
    <path d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" fill="#FF3D00"/>
    <path d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" fill="#4CAF50"/>
    <path d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" fill="#1976D2"/>
  </svg>
);

const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#333" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
);

const SignUp = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!agreeToTerms) {
      setError('You must agree to the Terms of Service and Privacy Policy');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await signup(email, password, firstName, lastName);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignUp = (provider) => {
    console.log(`Signing up with ${provider}`);
    // In a real app, this would use OAuth with the specified provider
  };

  return (
    <PageContainer>
      <SimpleHeader />
      <ContentContainer>
        <SignUpContainer>
          <SignUpForm>
            <SignUpHeader>
              <Title>Create your account</Title>
              <Subtitle>Start your journey with CodeAI</Subtitle>
            </SignUpHeader>
            
            <SocialButtons>
              <SocialButton onClick={() => handleSocialSignUp('Google')}>
                <GoogleIcon />
                Continue with Google
              </SocialButton>
              
              <SocialButton onClick={() => handleSocialSignUp('GitHub')}>
                <GitHubIcon />
                Continue with GitHub
              </SocialButton>
            </SocialButtons>
            
            <Divider>
              <span>Or continue with email</span>
            </Divider>
            
            <Form onSubmit={handleSubmit}>
              <FormRow>
                <FormGroup>
                  <Label htmlFor="firstName">First name</Label>
                  <Input 
                    type="text" 
                    id="firstName" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    required 
                  />
                </FormGroup>
                
                <FormGroup>
                  <Label htmlFor="lastName">Last name</Label>
                  <Input 
                    type="text" 
                    id="lastName" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    required 
                  />
                </FormGroup>
              </FormRow>
              
              <FormGroup>
                <Label htmlFor="email">Work email</Label>
                <Input 
                  type="email" 
                  id="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@company.com"
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
                  placeholder="Create a strong password"
                  required 
                  minLength="8"
                />
                <PasswordRequirement>Password must be at least 8 characters long</PasswordRequirement>
              </FormGroup>
              
              <TermsContainer>
                <Checkbox 
                  type="checkbox" 
                  id="terms" 
                  checked={agreeToTerms}
                  onChange={() => setAgreeToTerms(!agreeToTerms)}
                />
                <TermsText htmlFor="terms">
                  I agree to CodeAI's <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
                </TermsText>
              </TermsContainer>
              
              {error && <p style={{ color: '#dc3545', fontSize: '0.9rem', marginBottom: '1rem' }}>{error}</p>}
              
              <SignUpButton type="submit" disabled={isLoading || !agreeToTerms}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </SignUpButton>
            </Form>
            
            <SignInPrompt>
              Already have an account? <Link to="/signin">Sign in</Link>
            </SignInPrompt>
          </SignUpForm>
        </SignUpContainer>
        
        <ImageContainer>
          <PlaceholderImage />
          
        </ImageContainer>
      </ContentContainer>
    </PageContainer>
  );
};

export default SignUp;