
const mockQuestions = {
  Python: [
    {
      question: "Which keyword is used to define a function in Python?",
      options: ["function", "def", "fun", "define"],
      correctAnswer: 1,
      explanation: "The def keyword declares a function in Python.",
    },
    {
      question: "Which data type is used for an ordered, changeable collection?",
      options: ["Tuple", "Set", "List", "String"],
      correctAnswer: 2,
      explanation: "Lists preserve order and allow their elements to be changed.",
    },
    {
      question: "What is the output of print(2 ** 3)?",
      options: ["6", "8", "9", "5"],
      correctAnswer: 1,
      explanation: "The ** operator performs exponentiation, so 2 raised to 3 is 8.",
    },
    {
      question: "Which symbol starts a single-line comment in Python?",
      options: ["//", "/*", "#", "--"],
      correctAnswer: 2,
      explanation: "A # symbol begins a single-line comment in Python.",
    },
    {
      question: "Which method adds an item to the end of a list?",
      options: ["add()", "append()", "insertEnd()", "push()"],
      correctAnswer: 1,
      explanation: "The append() method adds an item to the end of a list.",
    },
    {
      question: "Which value represents the absence of a value in Python?",
      options: ["null", "undefined", "None", "void"],
      correctAnswer: 2,
      explanation: "Python uses None to represent the absence of a value.",
    },
    {
      question: "Which loop iterates over items in a sequence?",
      options: ["repeat", "foreach", "for", "loop"],
      correctAnswer: 2,
      explanation: "A for loop can iterate over items in a sequence.",
    },
    {
      question: "Which brackets are used to create a dictionary literal?",
      options: ["[]", "()", "{}", "<>"],
      correctAnswer: 2,
      explanation: "Dictionaries use curly braces with key-value pairs.",
    },
    {
      question: "What does len([10, 20, 30]) return?",
      options: ["2", "3", "10", "30"],
      correctAnswer: 1,
      explanation: "The list contains three elements, so len() returns 3.",
    },
    {
      question: "Which block handles an exception in Python?",
      options: ["catch", "except", "error", "rescue"],
      correctAnswer: 1,
      explanation: "An except block handles exceptions raised in a try block.",
    },
  ],
};

module.exports = mockQuestions;
