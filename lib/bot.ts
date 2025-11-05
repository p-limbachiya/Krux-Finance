import { BotResponse } from '@/types';

export const getBotResponse = (message: string, context?: any): BotResponse => {
  const lowerMessage = message.toLowerCase().trim();

  // Loan application help
  if (lowerMessage.includes('loan') || lowerMessage.includes('apply') || lowerMessage.includes('application')) {
    if (lowerMessage.includes('business') || lowerMessage.includes('msme')) {
      return {
        text: "Great! For Business/MSME loans, you'll need:\n\n• Business registration documents\n• GST certificate\n• Bank statements (last 6 months)\n• Income tax returns (last 2 years)\n• Business plan (for new businesses)\n\nWould you like to start an application, or do you have questions about any specific documents?",
        suggestions: ['Start Application', 'Document Requirements', 'Check Status', 'Talk to Agent'],
      };
    }
    if (lowerMessage.includes('personal')) {
      return {
        text: "For Personal loans, you'll need:\n\n• PAN card\n• Aadhaar card\n• Salary slips (last 3 months)\n• Bank statements (last 6 months)\n• Employment certificate\n\nWould you like to proceed with your application?",
        suggestions: ['Start Application', 'Document Requirements', 'Check Status', 'Talk to Agent'],
      };
    }
    return {
      text: "We offer several loan types:\n\n• **Business Loans** - For businesses and MSMEs\n• **Personal Loans** - For individual needs\n• **MSME Loans** - Specialized for small businesses\n\nWhich type of loan are you interested in?",
      suggestions: ['Business Loan', 'Personal Loan', 'MSME Loan', 'Talk to Agent'],
    };
  }

  // Document requirements
  if (lowerMessage.includes('document') || lowerMessage.includes('doc') || lowerMessage.includes('required')) {
    return {
      text: "Here are the general document requirements:\n\n**For Business/MSME Loans:**\n• Business registration certificate\n• GST certificate\n• Bank statements (6 months)\n• ITR (2 years)\n• Business plan\n\n**For Personal Loans:**\n• PAN & Aadhaar\n• Salary slips (3 months)\n• Bank statements (6 months)\n• Employment certificate\n\nNeed help with any specific document?",
      suggestions: ['Upload Documents', 'Check Status', 'Talk to Agent'],
    };
  }

  // Application status
  if (lowerMessage.includes('status') || lowerMessage.includes('check') || lowerMessage.includes('track')) {
    return {
      text: "To check your application status, I'll need your Application ID. Please provide it, or I can help you find it if you share your phone number or email.",
      suggestions: ['Enter Application ID', 'Talk to Agent'],
    };
  }

  // Greetings
  if (lowerMessage.match(/^(hi|hello|hey|good morning|good afternoon|good evening)/)) {
    return {
      text: "Hello! 👋 Welcome to KRUX Finance support. I'm here to help you with:\n\n• Loan applications\n• Document requirements\n• Application status\n• General inquiries\n\nHow can I assist you today?",
      suggestions: ['Loan Application', 'Document Help', 'Check Status', 'Talk to Agent'],
    };
  }

  // Help request
  if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
    return {
      text: "I'm here to help! You can:\n\n1. Get information about loan applications\n2. Learn about document requirements\n3. Check your application status\n4. Speak with a human agent\n\nWhat would you like to do?",
      suggestions: ['Loan Application', 'Document Help', 'Check Status', 'Talk to Agent'],
    };
  }

  // Agent request
  if (lowerMessage.includes('agent') || lowerMessage.includes('human') || lowerMessage.includes('person') || lowerMessage.includes('talk to')) {
    return {
      text: "I'll connect you with a human agent right away. Please wait while I create a support ticket for you...",
      requiresAgent: true,
    };
  }

  // Default response
  return {
    text: "I understand you're looking for help. Let me assist you better. Could you tell me:\n\n• Are you looking to apply for a loan?\n• Do you need help with documents?\n• Want to check your application status?\n• Or would you prefer to speak with a human agent?",
    suggestions: ['Loan Application', 'Document Help', 'Check Status', 'Talk to Agent'],
  };
};

