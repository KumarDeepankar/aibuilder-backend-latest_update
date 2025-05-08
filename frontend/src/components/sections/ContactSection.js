import React, { useState } from 'react';
import styled from 'styled-components';

const SectionContainer = styled.section`
  padding: 5rem 2rem;
  background-color: #f5f7fa;
  color: #2c303a;
  
  @media (max-width: 768px) {
    padding: 3rem 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 2.5rem 1rem;
  }
`;

const SectionContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.75rem;
  }
`;

const SectionDescription = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2.5rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const CTAButton = styled.button`
  padding: 1rem 2rem;
  background-color: #4285f4;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #5c94f5;
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  @media (max-width: 480px) {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
  }
`;

const ContactWrapper = styled.div`
  background-color: #ffffff;
  width: 100%;
  padding: 6rem 2rem;
  
  @media (max-width: 768px) {
    padding: 4rem 1.5rem;
  }
`;

const ContactContainer = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const FAQSection = styled.div`
  padding-right: 2rem;
  
  @media (max-width: 992px) {
    padding-right: 0;
    order: 2;
  }
`;

const FormSection = styled.div`
  @media (max-width: 992px) {
    order: 1;
  }
`;

const AccordionItem = styled.div`
  margin-bottom: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
    border-bottom: none;
  }
`;

const AccordionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 0.75rem 0;
`;

const AccordionTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c303a;
`;

const AccordionIcon = styled.span`
  color: #3B82F6;
  font-size: 1.5rem;
  transition: transform 0.3s ease;
  transform: ${props => props.isOpen ? 'rotate(45deg)' : 'rotate(0)'};
`;

const AccordionContent = styled.div`
  max-height: ${props => props.isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
`;

const AccordionText = styled.p`
  font-size: 0.95rem;
  line-height: 1.6;
  color: #6c757d;
  padding: 0.5rem 0 1rem;
`;

const ContactForm = styled.form`
  background-color: #f8fafc;
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid #e1e4e8;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
`;

const FormTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c303a;
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  color: #6c757d;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  border: 1px solid #e1e4e8;
  background-color: #ffffff;
  color: #2c303a;
  font-size: 1rem;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  border: 1px solid #e1e4e8;
  background-color: #ffffff;
  color: #2c303a;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SubmitButton = styled.button`
  background-color: #3B82F6;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.85rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
  width: 100%;
  
  &:hover {
    background-color: #2563EB;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
  }
`;

const faqItems = [
  {
    question: "How accurate is the code generated from my designs?",
    answer: "Our AI has been trained on millions of design-to-code examples, achieving a 95%+ accuracy rate. It captures exact spacing, colors, typography, and component structure. For complex designs, our platform allows easy manual adjustments to fine-tune the output."
  },
  {
    question: "What design file formats are supported?",
    answer: "We currently support JPG, PNG, and PDF screenshots, as well as direct Figma design imports via our plugin. We're working on adding support for Sketch and Adobe XD files in our next update."
  },
  {
    question: "Which frameworks and languages are supported for output?",
    answer: "We support React, Vue.js, Angular, and standard HTML/CSS. Each framework output includes responsive design, accessibility features, and follows best practices for that specific technology stack."
  },
  {
    question: "How do I customize the code style and structure?",
    answer: "You can customize naming conventions, component structure, CSS methodology (like BEM, CSS Modules, etc.), and code formatting. We also provide options for adding comments and documentation to make the generated code more maintainable."
  },
  {
    question: "Is there a limit to the number of designs I can convert?",
    answer: "Free accounts can convert up to 3 designs per month. Our Pro plan ($29/month) includes 50 conversions per month, while our Enterprise plan offers unlimited conversions with additional collaboration features."
  }
];

const ContactSection = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const toggleAccordion = (index) => {
    setOpenIndex(index === openIndex ? -1 : index);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here (e.g., API call)
    console.log('Form submitted:', formData);
    // Reset form after submission
    setFormData({ name: '', email: '', message: '' });
    // Show success message (not implemented in this example)
  };

  return (
    <ContactWrapper id="contact-faq">
      <ContactContainer>
        <FAQSection>
          <SectionTitle>Frequently Asked Questions</SectionTitle>
          
          {faqItems.map((item, index) => (
            <AccordionItem key={index}>
              <AccordionHeader onClick={() => toggleAccordion(index)}>
                <AccordionTitle>{item.question}</AccordionTitle>
                <AccordionIcon isOpen={index === openIndex}>+</AccordionIcon>
              </AccordionHeader>
              <AccordionContent isOpen={index === openIndex}>
                <AccordionText>{item.answer}</AccordionText>
              </AccordionContent>
            </AccordionItem>
          ))}
        </FAQSection>
        
        <FormSection>
          <ContactForm onSubmit={handleSubmit}>
            <FormTitle>Have More Questions?</FormTitle>
            
            <FormGroup>
              <Label htmlFor="name">Name</Label>
              <Input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                required 
                placeholder="Your name"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="email">Email</Label>
              <Input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                required 
                placeholder="your.email@example.com"
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="message">Message</Label>
              <Textarea 
                id="message" 
                name="message" 
                value={formData.message}
                onChange={handleChange}
                required 
                placeholder="How can we help you?"
              />
            </FormGroup>
            
            <SubmitButton type="submit">Submit</SubmitButton>
          </ContactForm>
        </FormSection>
      </ContactContainer>
    </ContactWrapper>
  );
};

export default ContactSection;