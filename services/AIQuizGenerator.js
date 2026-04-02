const QuizQuestion = require('../models/QuizQuestion');
const LearningResource = require('../models/LearningResource');

class AIQuizGenerator {
  constructor() {
    this.questionTemplates = {
      'IT': {
        'Easy': [
          'What is {concept}?',
          'Which of the following is true about {concept}?',
          'What does {acronym} stand for?',
          'In {technology}, what is the purpose of {feature}?'
        ],
        'Medium': [
          'How does {concept} work in {context}?',
          'What is the difference between {concept1} and {concept2}?',
          'Which approach is best for {scenario}?',
          'What happens when you {action} in {technology}?'
        ],
        'Hard': [
          'Analyze the following code: {code}. What will be the output?',
          'Given the constraints {constraints}, which solution is optimal?',
          'Debug this scenario: {scenario}. What is the issue?',
          'Design a solution for {problem} considering {factors}.'
        ]
      },
      'DataScience': {
        'Easy': [
          'What is {concept} in data science?',
          'Which algorithm is used for {task}?',
          'What does {metric} measure?',
          'In {context}, what is {term}?'
        ],
        'Medium': [
          'How do you handle {problem} in {context}?',
          'What is the difference between {method1} and {method2}?',
          'When should you use {algorithm}?',
          'What are the assumptions of {model}?'
        ],
        'Hard': [
          'Given dataset with {characteristics}, which approach is best?',
          'Analyze this model performance: {metrics}. What can you conclude?',
          'Design a pipeline for {scenario} with constraints {constraints}.',
          'Optimize this algorithm for {specific_case}.'
        ]
      },
      'Healthcare': {
        'Easy': [
          'What is {medical_term}?',
          'Which organ is responsible for {function}?',
          'What are the symptoms of {condition}?',
          'What does {abbreviation} stand for in medicine?'
        ],
        'Medium': [
          'How is {condition} diagnosed?',
          'What is the mechanism of action of {drug}?',
          'What are the contraindications for {treatment}?',
          'How do you differentiate between {condition1} and {condition2}?'
        ],
        'Hard': [
          'Analyze this case: {case_study}. What is your diagnosis?',
          'Given these lab results: {results}, what is the likely condition?',
          'Design a treatment plan for {complex_case}.',
          'What are the ethical considerations in {scenario}?'
        ]
      }
    };

    this.knowledgeBase = {
      'IT': {
        'HTML': {
          concepts: ['DOM', 'semantic elements', 'attributes', 'forms', 'accessibility'],
          acronyms: ['HTML', 'CSS', 'DOM', 'API', 'URL'],
          technologies: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Vue'],
          features: ['semantic tags', 'form validation', 'local storage', 'canvas']
        },
        'JavaScript': {
          concepts: ['closures', 'hoisting', 'prototypes', 'async/await', 'promises'],
          technologies: ['Node.js', 'React', 'Vue', 'Angular', 'Express'],
          features: ['arrow functions', 'destructuring', 'modules', 'classes']
        },
        'React': {
          concepts: ['components', 'state', 'props', 'hooks', 'context'],
          features: ['JSX', 'virtual DOM', 'lifecycle methods', 'state management']
        }
      },
      'DataScience': {
        'Statistics': {
          concepts: ['mean', 'median', 'standard deviation', 'correlation', 'regression'],
          metrics: ['accuracy', 'precision', 'recall', 'F1-score', 'AUC'],
          algorithms: ['linear regression', 'logistic regression', 'decision trees', 'random forest']
        },
        'MachineLearning': {
          algorithms: ['SVM', 'neural networks', 'k-means', 'naive bayes'],
          concepts: ['overfitting', 'cross-validation', 'feature selection', 'dimensionality reduction']
        }
      },
      'Healthcare': {
        'Anatomy': {
          organs: ['heart', 'liver', 'kidneys', 'lungs', 'brain'],
          systems: ['cardiovascular', 'respiratory', 'nervous', 'digestive']
        },
        'Pharmacology': {
          drugs: ['aspirin', 'insulin', 'antibiotics', 'antihypertensives'],
          mechanisms: ['enzyme inhibition', 'receptor binding', 'ion channel blocking']
        }
      }
    };
  }

  async generateQuiz(domain, topic, level, difficulty, questionCount = 10) {
    try {
      console.log(`Generating quiz for ${domain} - ${topic} - Level ${level} - ${difficulty}`);
      
      // First, try to get existing questions
      const existingQuestions = await this.getExistingQuestions(domain, topic, level, difficulty, questionCount);
      
      if (existingQuestions.length >= questionCount) {
        return existingQuestions.slice(0, questionCount);
      }

      // Generate new questions to fill the gap
      const neededQuestions = questionCount - existingQuestions.length;
      const newQuestions = await this.generateNewQuestions(domain, topic, level, difficulty, neededQuestions);
      
      // Save new questions to database
      for (const question of newQuestions) {
        await this.saveQuestion(question);
      }

      return [...existingQuestions, ...newQuestions];
    } catch (error) {
      console.error('Error generating quiz:', error);
      throw error;
    }
  }

  async getExistingQuestions(domain, topic, level, difficulty, count) {
    return await QuizQuestion.find({
      domain,
      topic,
      level,
      difficulty,
      validated: true
    }).limit(count).lean();
  }

  async generateNewQuestions(domain, topic, level, difficulty, count) {
    const questions = [];
    const templates = this.questionTemplates[domain]?.[difficulty] || this.questionTemplates['IT']['Easy'];
    const knowledge = this.knowledgeBase[domain]?.[topic] || this.knowledgeBase['IT']['HTML'];

    for (let i = 0; i < count; i++) {
      const question = await this.generateSingleQuestion(domain, topic, level, difficulty, templates, knowledge);
      questions.push(question);
    }

    return questions;
  }

  async generateSingleQuestion(domain, topic, level, difficulty, templates, knowledge) {
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    // Generate question based on domain and topic
    let questionData;
    
    switch (domain) {
      case 'IT':
        questionData = this.generateITQuestion(topic, level, difficulty, template, knowledge);
        break;
      case 'DataScience':
        questionData = this.generateDataScienceQuestion(topic, level, difficulty, template, knowledge);
        break;
      case 'Healthcare':
        questionData = this.generateHealthcareQuestion(topic, level, difficulty, template, knowledge);
        break;
      case 'Finance':
        questionData = this.generateFinanceQuestion(topic, level, difficulty, template);
        break;
      case 'Aptitude':
        questionData = this.generateAptitudeQuestion(topic, level, difficulty);
        break;
      default:
        questionData = this.generateGenericQuestion(topic, level, difficulty, template);
    }

    return {
      domain,
      topic,
      level,
      difficulty,
      ...questionData,
      aiGenerated: true,
      validated: true, // Auto-validate AI generated questions
      source: {
        platform: 'AI Generator',
        url: 'internal://ai-generated',
        title: `AI Generated ${domain} Question`
      },
      tags: [topic, difficulty.toLowerCase(), domain.toLowerCase()],
      estimatedTime: this.getEstimatedTime(difficulty)
    };
  }

  generateITQuestion(topic, level, difficulty, template, knowledge) {
    const concepts = knowledge.concepts || ['programming', 'development', 'coding'];
    const technologies = knowledge.technologies || ['JavaScript', 'HTML', 'CSS'];
    
    switch (topic.toLowerCase()) {
      case 'html':
        return this.generateHTMLQuestion(difficulty);
      case 'css':
        return this.generateCSSQuestion(difficulty);
      case 'javascript':
        return this.generateJavaScriptQuestion(difficulty);
      case 'react':
        return this.generateReactQuestion(difficulty);
      default:
        return this.generateGenericITQuestion(topic, difficulty);
    }
  }

  generateHTMLQuestion(difficulty) {
    const questions = {
      'Easy': [
        {
          question: "What does HTML stand for?",
          options: [
            { text: "Hyper Text Markup Language", isCorrect: true },
            { text: "High Tech Modern Language", isCorrect: false },
            { text: "Home Tool Markup Language", isCorrect: false },
            { text: "Hyperlink and Text Markup Language", isCorrect: false }
          ],
          explanation: "HTML stands for Hyper Text Markup Language, which is the standard markup language for creating web pages."
        },
        {
          question: "Which HTML element is used for the largest heading?",
          options: [
            { text: "<h1>", isCorrect: true },
            { text: "<h6>", isCorrect: false },
            { text: "<heading>", isCorrect: false },
            { text: "<head>", isCorrect: false }
          ],
          explanation: "<h1> is the HTML element for the largest heading, with <h6> being the smallest."
        }
      ],
      'Medium': [
        {
          question: "Which HTML attribute is used to define inline styles?",
          options: [
            { text: "style", isCorrect: true },
            { text: "class", isCorrect: false },
            { text: "font", isCorrect: false },
            { text: "styles", isCorrect: false }
          ],
          explanation: "The 'style' attribute is used to define inline CSS styles for HTML elements."
        }
      ],
      'Hard': [
        {
          question: "What is the purpose of the 'data-*' attributes in HTML5?",
          options: [
            { text: "To store custom data private to the page or application", isCorrect: true },
            { text: "To define database connections", isCorrect: false },
            { text: "To create data tables", isCorrect: false },
            { text: "To validate form data", isCorrect: false }
          ],
          explanation: "Data-* attributes allow you to store extra information on standard HTML elements without using non-standard attributes."
        }
      ]
    };

    const questionSet = questions[difficulty] || questions['Easy'];
    return questionSet[Math.floor(Math.random() * questionSet.length)];
  }

  generateCSSQuestion(difficulty) {
    const questions = {
      'Easy': [
        {
          question: "Which CSS property is used to change the text color?",
          options: [
            { text: "color", isCorrect: true },
            { text: "text-color", isCorrect: false },
            { text: "font-color", isCorrect: false },
            { text: "foreground-color", isCorrect: false }
          ],
          explanation: "The 'color' property in CSS is used to set the color of text."
        }
      ],
      'Medium': [
        {
          question: "What does the CSS property 'display: flex' do?",
          options: [
            { text: "Creates a flexible container for layout", isCorrect: true },
            { text: "Makes text flexible", isCorrect: false },
            { text: "Displays content flexibly", isCorrect: false },
            { text: "Creates flexible images", isCorrect: false }
          ],
          explanation: "Display: flex creates a flex container, enabling flexible box layout for its children."
        }
      ],
      'Hard': [
        {
          question: "What is the difference between 'em' and 'rem' units in CSS?",
          options: [
            { text: "em is relative to parent element, rem is relative to root element", isCorrect: true },
            { text: "em is for margins, rem is for padding", isCorrect: false },
            { text: "em is older, rem is newer", isCorrect: false },
            { text: "No difference, they're interchangeable", isCorrect: false }
          ],
          explanation: "em units are relative to the font-size of the parent element, while rem units are relative to the root element's font-size."
        }
      ]
    };

    const questionSet = questions[difficulty] || questions['Easy'];
    return questionSet[Math.floor(Math.random() * questionSet.length)];
  }

  generateJavaScriptQuestion(difficulty) {
    const questions = {
      'Easy': [
        {
          question: "Which of the following is the correct way to declare a variable in JavaScript?",
          options: [
            { text: "let myVar;", isCorrect: true },
            { text: "variable myVar;", isCorrect: false },
            { text: "v myVar;", isCorrect: false },
            { text: "declare myVar;", isCorrect: false }
          ],
          explanation: "'let' is the modern way to declare variables in JavaScript, along with 'const' and 'var'."
        }
      ],
      'Medium': [
        {
          question: "What will console.log(typeof null) output?",
          options: [
            { text: "object", isCorrect: true },
            { text: "null", isCorrect: false },
            { text: "undefined", isCorrect: false },
            { text: "boolean", isCorrect: false }
          ],
          explanation: "typeof null returns 'object' in JavaScript, which is a known quirk of the language."
        }
      ],
      'Hard': [
        {
          question: "What is a closure in JavaScript?",
          options: [
            { text: "A function that has access to variables in its outer scope", isCorrect: true },
            { text: "A way to close browser windows", isCorrect: false },
            { text: "A method to end loops", isCorrect: false },
            { text: "A type of error handling", isCorrect: false }
          ],
          explanation: "A closure is a function that retains access to variables from its outer (enclosing) scope even after the outer function has returned."
        }
      ]
    };

    const questionSet = questions[difficulty] || questions['Easy'];
    return questionSet[Math.floor(Math.random() * questionSet.length)];
  }

  generateHealthcareQuestion(topic, level, difficulty, template, knowledge) {
    const questions = {
      'Easy': [
        {
          question: "What is the normal resting heart rate for adults?",
          options: [
            { text: "60-100 beats per minute", isCorrect: true },
            { text: "40-60 beats per minute", isCorrect: false },
            { text: "100-120 beats per minute", isCorrect: false },
            { text: "120-140 beats per minute", isCorrect: false }
          ],
          explanation: "The normal resting heart rate for adults ranges from 60 to 100 beats per minute."
        },
        {
          question: "In a clinical setting, what is the first priority when a patient arrives with chest pain?",
          options: [
            { text: "Assess vital signs and perform ECG", isCorrect: true },
            { text: "Take detailed medical history", isCorrect: false },
            { text: "Order blood tests", isCorrect: false },
            { text: "Prescribe pain medication", isCorrect: false }
          ],
          explanation: "In chest pain cases, immediate assessment of vital signs and ECG is crucial to rule out cardiac emergencies."
        }
      ],
      'Medium': [
        {
          question: "A patient presents with shortness of breath, chest pain, and leg swelling. What is the most likely diagnosis?",
          options: [
            { text: "Congestive heart failure", isCorrect: true },
            { text: "Pneumonia", isCorrect: false },
            { text: "Asthma", isCorrect: false },
            { text: "Anxiety disorder", isCorrect: false }
          ],
          explanation: "The combination of shortness of breath, chest pain, and leg swelling (edema) strongly suggests congestive heart failure."
        },
        {
          question: "When administering medication, what is the most critical safety check?",
          options: [
            { text: "Verify patient identity, medication, dose, route, and time", isCorrect: true },
            { text: "Check only the medication name", isCorrect: false },
            { text: "Confirm with one colleague", isCorrect: false },
            { text: "Review patient's insurance", isCorrect: false }
          ],
          explanation: "The 'Five Rights' of medication administration ensure patient safety: right patient, medication, dose, route, and time."
        }
      ],
      'Hard': [
        {
          question: "A 65-year-old diabetic patient presents with altered mental status, fruity breath odor, and dehydration. Lab shows glucose 450 mg/dL, ketones positive. What is the immediate treatment priority?",
          options: [
            { text: "IV fluid resuscitation and insulin therapy", isCorrect: true },
            { text: "Oral hypoglycemic agents", isCorrect: false },
            { text: "Immediate surgery", isCorrect: false },
            { text: "Antibiotics only", isCorrect: false }
          ],
          explanation: "This presentation suggests diabetic ketoacidosis (DKA). Immediate treatment requires IV fluids for dehydration and insulin to correct hyperglycemia and ketosis."
        }
      ]
    };

    const questionSet = questions[difficulty] || questions['Easy'];
    return questionSet[Math.floor(Math.random() * questionSet.length)];
  }

  generateFinanceQuestion(topic, level, difficulty, template) {
    const questions = {
      'Easy': [
        {
          question: "What does ROI stand for in finance?",
          options: [
            { text: "Return on Investment", isCorrect: true },
            { text: "Rate of Interest", isCorrect: false },
            { text: "Risk of Investment", isCorrect: false },
            { text: "Revenue over Income", isCorrect: false }
          ],
          explanation: "ROI stands for Return on Investment, which measures the efficiency of an investment."
        },
        {
          question: "A client's portfolio has declined 20% in a volatile market. What is the best approach?",
          options: [
            { text: "Review risk tolerance, rebalance if needed, and provide market context", isCorrect: true },
            { text: "Immediately sell all positions", isCorrect: false },
            { text: "Ignore the decline and wait", isCorrect: false },
            { text: "Invest more money immediately", isCorrect: false }
          ],
          explanation: "Professional financial management requires assessing risk tolerance, strategic rebalancing, and clear client communication during market volatility."
        }
      ],
      'Medium': [
        {
          question: "When analyzing a company for investment, what is the most important financial ratio to consider first?",
          options: [
            { text: "Debt-to-equity ratio to assess financial stability", isCorrect: true },
            { text: "Only the stock price", isCorrect: false },
            { text: "Number of employees", isCorrect: false },
            { text: "Company age", isCorrect: false }
          ],
          explanation: "The debt-to-equity ratio provides crucial insight into a company's financial leverage and stability, which is fundamental for investment analysis."
        },
        {
          question: "A startup seeks $500K funding with 20% equity offer. They project $2M revenue in year 3. What's your primary concern?",
          options: [
            { text: "Validate revenue projections and assess market size", isCorrect: true },
            { text: "Accept immediately based on projections", isCorrect: false },
            { text: "Focus only on the equity percentage", isCorrect: false },
            { text: "Reject without analysis", isCorrect: false }
          ],
          explanation: "Due diligence requires validating financial projections and assessing market opportunity before making investment decisions."
        }
      ],
      'Hard': [
        {
          question: "Your client wants to retire in 10 years with $1M. They have $400K now and can save $2K/month. Assuming 7% annual return, will they reach their goal?",
          options: [
            { text: "Yes, they will have approximately $1.1M", isCorrect: true },
            { text: "No, they will fall short", isCorrect: false },
            { text: "Impossible to calculate", isCorrect: false },
            { text: "They need to double their savings", isCorrect: false }
          ],
          explanation: "Using compound interest: $400K growing at 7% for 10 years = $787K, plus $2K monthly for 10 years at 7% = $331K. Total ≈ $1.1M."
        }
      ]
    };

    const questionSet = questions[difficulty] || questions['Easy'];
    return questionSet[Math.floor(Math.random() * questionSet.length)];
  }

  generateReactQuestion(difficulty) {
    const questions = {
      'Easy': [
        {
          question: "What is React?",
          options: [
            { text: "A JavaScript library for building user interfaces", isCorrect: true },
            { text: "A database management system", isCorrect: false },
            { text: "A web server", isCorrect: false },
            { text: "A CSS framework", isCorrect: false }
          ],
          explanation: "React is a JavaScript library developed by Facebook for building user interfaces."
        },
        {
          question: "In a React project, you need to display a list of user profiles. What's the best approach?",
          options: [
            { text: "Use map() to render components for each user with unique keys", isCorrect: true },
            { text: "Create individual components manually for each user", isCorrect: false },
            { text: "Use innerHTML to insert HTML", isCorrect: false },
            { text: "Use jQuery to manipulate the DOM", isCorrect: false }
          ],
          explanation: "React best practice is to use map() to render lists of components, with unique keys for efficient re-rendering."
        }
      ],
      'Medium': [
        {
          question: "Your React app is re-rendering too frequently, causing performance issues. What's the first optimization to try?",
          options: [
            { text: "Use React.memo() to prevent unnecessary re-renders", isCorrect: true },
            { text: "Rewrite the entire component", isCorrect: false },
            { text: "Use class components instead", isCorrect: false },
            { text: "Add more state variables", isCorrect: false }
          ],
          explanation: "React.memo() is a higher-order component that prevents re-renders when props haven't changed, improving performance."
        }
      ],
      'Hard': [
        {
          question: "You're building a complex form with multiple dependent fields. What's the best state management approach?",
          options: [
            { text: "Use useReducer for complex state logic with multiple related updates", isCorrect: true },
            { text: "Use multiple useState hooks for each field", isCorrect: false },
            { text: "Store everything in localStorage", isCorrect: false },
            { text: "Use global variables", isCorrect: false }
          ],
          explanation: "useReducer is ideal for complex state logic where multiple state updates depend on each other, providing better predictability."
        }
      ]
    };

    const questionSet = questions[difficulty] || questions['Easy'];
    return questionSet[Math.floor(Math.random() * questionSet.length)];
  }

  generateGenericITQuestion(topic, difficulty) {
    const questions = {
      'Easy': [
        {
          question: `What is the most important principle when working with ${topic}?`,
          options: [
            { text: `Understanding the fundamentals and best practices of ${topic}`, isCorrect: true },
            { text: `Using the most complex features available`, isCorrect: false },
            { text: `Avoiding documentation and learning by trial and error`, isCorrect: false },
            { text: `Copying code without understanding it`, isCorrect: false }
          ],
          explanation: `Understanding fundamentals and following best practices is crucial for effective ${topic} development.`
        }
      ],
      'Medium': [
        {
          question: `When debugging a ${topic} issue in production, what's your first step?`,
          options: [
            { text: `Check logs and reproduce the issue in a controlled environment`, isCorrect: true },
            { text: `Make random changes to see what works`, isCorrect: false },
            { text: `Restart the entire system immediately`, isCorrect: false },
            { text: `Ignore the issue and hope it resolves itself`, isCorrect: false }
          ],
          explanation: `Systematic debugging starts with log analysis and controlled reproduction to understand the root cause.`
        }
      ]
    };

    const questionSet = questions[difficulty] || questions['Easy'];
    return questionSet[Math.floor(Math.random() * questionSet.length)];
  }

  generateDataScienceQuestion(topic, level, difficulty, template, knowledge) {
    const questions = {
      'Easy': [
        {
          question: "What is the purpose of cross-validation in machine learning?",
          options: [
            { text: "To assess model performance and prevent overfitting", isCorrect: true },
            { text: "To increase dataset size", isCorrect: false },
            { text: "To clean data", isCorrect: false },
            { text: "To visualize data", isCorrect: false }
          ],
          explanation: "Cross-validation helps evaluate how well a model generalizes to unseen data by testing it on different subsets."
        },
        {
          question: "Your e-commerce company wants to predict customer lifetime value. What type of machine learning problem is this?",
          options: [
            { text: "Regression problem - predicting continuous numerical values", isCorrect: true },
            { text: "Classification problem - predicting categories", isCorrect: false },
            { text: "Clustering problem - grouping similar customers", isCorrect: false },
            { text: "Reinforcement learning problem", isCorrect: false }
          ],
          explanation: "Customer lifetime value is a continuous numerical prediction, making it a regression problem."
        }
      ],
      'Medium': [
        {
          question: "Your model shows 95% accuracy on training data but 60% on test data. What's the most likely issue?",
          options: [
            { text: "Overfitting - the model memorized training data instead of learning patterns", isCorrect: true },
            { text: "Underfitting - the model is too simple", isCorrect: false },
            { text: "Data quality issues", isCorrect: false },
            { text: "Incorrect evaluation metrics", isCorrect: false }
          ],
          explanation: "Large gap between training and test performance indicates overfitting, where the model doesn't generalize well."
        },
        {
          question: "You're analyzing customer churn data and find that 95% of customers don't churn. How should you handle this imbalanced dataset?",
          options: [
            { text: "Use techniques like SMOTE, adjust class weights, or use appropriate metrics like F1-score", isCorrect: true },
            { text: "Ignore the imbalance and use accuracy as the main metric", isCorrect: false },
            { text: "Remove all non-churning customers", isCorrect: false },
            { text: "Use only precision as the evaluation metric", isCorrect: false }
          ],
          explanation: "Imbalanced datasets require special handling through sampling techniques, class weights, and appropriate evaluation metrics."
        }
      ],
      'Hard': [
        {
          question: "Your recommendation system needs to handle the cold start problem for new users. What's the best approach?",
          options: [
            { text: "Use content-based filtering with demographic data and popular items", isCorrect: true },
            { text: "Wait until users have enough interaction history", isCorrect: false },
            { text: "Recommend random items", isCorrect: false },
            { text: "Use only collaborative filtering", isCorrect: false }
          ],
          explanation: "Cold start problems require content-based approaches using available user demographics and popular items until sufficient interaction data is collected."
        }
      ]
    };

    const questionSet = questions[difficulty] || questions['Easy'];
    return questionSet[Math.floor(Math.random() * questionSet.length)];
  }

  generateInterviewQuestion(topic, difficulty) {
    const questions = {
      'Behavioral Questions': {
        'Easy': [
          {
            question: "Tell me about yourself.",
            options: [
              { text: "Focus on professional background, key achievements, and career goals", isCorrect: true },
              { text: "Share personal life details and hobbies", isCorrect: false },
              { text: "List all previous job titles chronologically", isCorrect: false },
              { text: "Discuss salary expectations and benefits", isCorrect: false }
            ],
            explanation: "A good self-introduction should focus on professional background, key achievements, and how they align with the role."
          },
          {
            question: "Describe a challenging project you worked on. How did you handle it?",
            options: [
              { text: "Use the STAR method: Situation, Task, Action, Result with specific examples", isCorrect: true },
              { text: "Blame team members for the challenges", isCorrect: false },
              { text: "Say you never faced any challenges", isCorrect: false },
              { text: "Focus only on the problems without mentioning solutions", isCorrect: false }
            ],
            explanation: "The STAR method provides a structured way to showcase problem-solving skills and achievements."
          }
        ],
        'Medium': [
          {
            question: "How do you handle conflict with a coworker?",
            options: [
              { text: "Address the issue directly and professionally, seeking common ground", isCorrect: true },
              { text: "Avoid the person and hope the problem resolves itself", isCorrect: false },
              { text: "Complain to other colleagues about the person", isCorrect: false },
              { text: "Immediately escalate to management", isCorrect: false }
            ],
            explanation: "Professional conflict resolution involves direct communication and collaborative problem-solving."
          }
        ]
      },
      'Technical Questions': {
        'Easy': [
          {
            question: "How would you explain a complex technical concept to a non-technical stakeholder?",
            options: [
              { text: "Use analogies, simple language, and focus on business impact", isCorrect: true },
              { text: "Use all technical jargon to show expertise", isCorrect: false },
              { text: "Tell them it's too complicated to understand", isCorrect: false },
              { text: "Draw complex technical diagrams", isCorrect: false }
            ],
            explanation: "Effective technical communication requires simplification and relating concepts to business value."
          }
        ]
      }
    };

    const topicQuestions = questions[topic] || questions['Behavioral Questions'];
    const difficultyQuestions = topicQuestions[difficulty] || topicQuestions['Easy'];
    
    return difficultyQuestions[Math.floor(Math.random() * difficultyQuestions.length)];
  }
  generateAptitudeQuestion(topic, difficulty) {
    const questions = {
      'Easy': [
        {
          question: "If a train travels 60 km in 1 hour, how far will it travel in 2.5 hours?",
          options: [
            { text: "150 km", isCorrect: true },
            { text: "120 km", isCorrect: false },
            { text: "180 km", isCorrect: false },
            { text: "200 km", isCorrect: false }
          ],
          explanation: "Distance = Speed × Time = 60 km/h × 2.5 h = 150 km"
        },
        {
          question: "What is 25% of 80?",
          options: [
            { text: "20", isCorrect: true },
            { text: "15", isCorrect: false },
            { text: "25", isCorrect: false },
            { text: "30", isCorrect: false }
          ],
          explanation: "25% of 80 = (25/100) × 80 = 0.25 × 80 = 20"
        },
        {
          question: "Complete the series: 2, 4, 8, 16, ?",
          options: [
            { text: "32", isCorrect: true },
            { text: "24", isCorrect: false },
            { text: "20", isCorrect: false },
            { text: "28", isCorrect: false }
          ],
          explanation: "Each number is double the previous: 2×2=4, 4×2=8, 8×2=16, 16×2=32"
        }
      ],
      'Medium': [
        {
          question: "A shopkeeper marks his goods 40% above cost price and gives a discount of 20%. What is his profit percentage?",
          options: [
            { text: "12%", isCorrect: true },
            { text: "20%", isCorrect: false },
            { text: "15%", isCorrect: false },
            { text: "10%", isCorrect: false }
          ],
          explanation: "Marked price = 140% of CP. Selling price = 80% of 140% = 112% of CP. Profit = 12%"
        },
        {
          question: "In a certain code, COMPUTER is written as RFUVQNPC. How is MEDICINE written in that code?",
          options: [
            { text: "EOJDJMFN", isCorrect: true },
            { text: "NFEJDJOF", isCorrect: false },
            { text: "MFEJDJOF", isCorrect: false },
            { text: "FOJDJMFN", isCorrect: false }
          ],
          explanation: "Each letter is shifted by +3 positions in the alphabet: M→P, E→H, D→G, etc."
        }
      ],
      'Hard': [
        {
          question: "A company's revenue increased by 25% in the first year and decreased by 20% in the second year. What is the overall percentage change?",
          options: [
            { text: "0% (no change)", isCorrect: true },
            { text: "5% increase", isCorrect: false },
            { text: "5% decrease", isCorrect: false },
            { text: "10% increase", isCorrect: false }
          ],
          explanation: "Let initial revenue = 100. After first year = 125. After second year = 125 × 0.8 = 100. No net change."
        }
      ]
    };

    const questionSet = questions[difficulty] || questions['Easy'];
    return questionSet[Math.floor(Math.random() * questionSet.length)];
  }

  generateGenericQuestion(topic, level, difficulty, template) {
    return {
      question: `What is the most important concept in ${topic}?`,
      options: [
        { text: `Understanding ${topic} fundamentals`, isCorrect: true },
        { text: `Memorizing ${topic} syntax`, isCorrect: false },
        { text: `Avoiding ${topic} completely`, isCorrect: false },
        { text: `Using ${topic} without learning`, isCorrect: false }
      ],
      explanation: `Understanding the fundamentals of ${topic} is crucial for building a strong foundation.`
    };
  }

  getEstimatedTime(difficulty) {
    const timeMap = {
      'Easy': 30,
      'Medium': 60,
      'Hard': 90,
      'Expert': 120
    };
    return timeMap[difficulty] || 60;
  }

  async saveQuestion(questionData) {
    try {
      const question = new QuizQuestion(questionData);
      await question.save();
      return question;
    } catch (error) {
      console.error('Error saving question:', error);
      throw error;
    }
  }

  async validateQuizResults(userId, quizAttempt) {
    const { score, domain, level } = quizAttempt;
    
    let feedback = {
      strengths: [],
      weaknesses: [],
      recommendations: []
    };

    // Determine next action based on score
    if (score >= 80) {
      quizAttempt.nextLevelUnlocked = true;
      feedback.strengths.push(`Excellent performance in ${domain} Level ${level}`);
      feedback.recommendations.push(`Ready to advance to Level ${level + 1}`);
    } else if (score >= 50) {
      quizAttempt.retryRecommended = true;
      feedback.recommendations.push(`Review the topics and retry Level ${level}`);
    } else {
      quizAttempt.practiceRecommended = true;
      feedback.weaknesses.push(`Need more practice in ${domain} fundamentals`);
      feedback.recommendations.push(`Complete practice exercises before retrying`);
    }

    quizAttempt.feedback = feedback;
    return quizAttempt;
  }
}

module.exports = new AIQuizGenerator();