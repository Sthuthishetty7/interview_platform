
const mockQuestions = {
  // ==========================================
  // 1. PYTHON MOCK TEST - 10 QUESTIONS
  // ==========================================
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

  // ==========================================
  // 2. JAVA MOCK TEST - 10 QUESTIONS
  // ==========================================
  Java: [
    {
      question: "Which keyword is used to inherit a class in Java?",
      options: ["implements", "extends", "inherits", "super"],
      correctAnswer: 1,
      explanation: "The extends keyword allows a class to inherit another class.",
    },
    {
      question: "Which of the following is not a primitive data type in Java?",
      options: ["int", "char", "boolean", "String"],
      correctAnswer: 3,
      explanation: "String is a class in Java, not a primitive data type.",
    },
    {
      question: "Which method is the entry point of a Java application?",
      options: ["start()", "run()", "main()", "execute()"],
      correctAnswer: 2,
      explanation: "The main() method is the standard entry point of a Java application.",
    },
    {
      question: "Which concept allows one interface to have multiple implementations?",
      options: ["Encapsulation", "Polymorphism", "Compilation", "Abstraction only"],
      correctAnswer: 1,
      explanation: "Polymorphism allows the same interface or reference type to represent different implementations.",
    },
    {
      question: "Which keyword is used to prevent a class from being inherited?",
      options: ["static", "final", "private", "abstract"],
      correctAnswer: 1,
      explanation: "A final class cannot be extended by another class.",
    },
    {
      question: "Which collection does not allow duplicate elements?",
      options: ["ArrayList", "LinkedList", "HashSet", "Vector"],
      correctAnswer: 2,
      explanation: "HashSet stores unique elements and does not allow duplicates.",
    },
    {
      question: "What is method overloading in Java?",
      options: [
        "Using the same method name with different parameter lists",
        "Defining a method outside a class",
        "Changing a variable's data type",
        "Calling a method repeatedly"
      ],
      correctAnswer: 0,
      explanation: "Method overloading means defining multiple methods with the same name but different parameter lists.",
    },
    {
      question: "Which exception occurs when an integer is divided by zero?",
      options: [
        "NullPointerException",
        "IOException",
        "ArithmeticException",
        "ClassNotFoundException"
      ],
      correctAnswer: 2,
      explanation: "Integer division by zero causes ArithmeticException in Java.",
    },
    {
      question: "Which wrapper class corresponds to the primitive type int?",
      options: ["Int", "Integer", "Number", "Long"],
      correctAnswer: 1,
      explanation: "Integer is the wrapper class for the primitive int type.",
    },
    {
      question: "What is the purpose of synchronization in Java?",
      options: [
        "To increase variable size",
        "To prevent all exceptions",
        "To control concurrent access to shared resources",
        "To convert objects into strings"
      ],
      correctAnswer: 2,
      explanation: "Synchronization controls access to shared resources so that threads do not interfere with each other.",
    },
  ],

  // ==========================================
  // 3. C PROGRAMMING MOCK TEST - 10 QUESTIONS
  // ==========================================
  "C Programming": [
    {
      question: "Which function is used to display output in C?",
      options: ["scanf()", "printf()", "print()", "display()"],
      correctAnswer: 1,
      explanation: "printf() is used to display formatted output in C.",
    },
    {
      question: "Which symbol is used to terminate a statement in C?",
      options: [":", ".", ";", ","],
      correctAnswer: 2,
      explanation: "A semicolon terminates most statements in C.",
    },
    {
      question: "Which header file is required for printf() and scanf()?",
      options: ["stdlib.h", "string.h", "stdio.h", "math.h"],
      correctAnswer: 2,
      explanation: "stdio.h declares standard input/output functions such as printf() and scanf().",
    },
    {
      question: "What is the index of the first element in a C array?",
      options: ["1", "-1", "0", "Depends on array size"],
      correctAnswer: 2,
      explanation: "C arrays use zero-based indexing, so the first element is at index 0.",
    },
    {
      question: "Which operator is used to access the value stored at a pointer address?",
      options: ["&", "*", "%", "#"],
      correctAnswer: 1,
      explanation: "The * operator dereferences a pointer and accesses the value at the address it stores.",
    },
    {
      question: "What is the output of printf(\"%d\", 10 / 3) in C?",
      options: ["3.33", "3", "4", "3.0"],
      correctAnswer: 1,
      explanation: "Both operands are integers, so integer division produces 3 and discards the fractional part.",
    },
    {
      question: "Which function is used to dynamically allocate memory in C?",
      options: ["alloc()", "new()", "malloc()", "create()"],
      correctAnswer: 2,
      explanation: "malloc() allocates a block of memory dynamically from the heap.",
    },
    {
      question: "Which function releases dynamically allocated memory?",
      options: ["delete()", "remove()", "free()", "clear()"],
      correctAnswer: 2,
      explanation: "free() releases memory previously allocated dynamically using functions such as malloc().",
    },
    {
      question: "What is recursion in C?",
      options: [
        "A function calling itself",
        "A loop running forever",
        "A variable calling another variable",
        "A program without functions"
      ],
      correctAnswer: 0,
      explanation: "Recursion occurs when a function calls itself, usually with a base condition to stop.",
    },
    {
      question: "What is the main purpose of a structure in C?",
      options: [
        "To store only integers",
        "To define a function",
        "To group variables of different data types under one name",
        "To repeat a loop"
      ],
      correctAnswer: 2,
      explanation: "A structure groups related members, which can have different data types, under one user-defined type.",
    },
  ],

  // ==========================================
  // 4. DBMS MOCK TEST - 10 QUESTIONS
  // ==========================================
  DBMS: [
    {
      question: "What does DBMS stand for?",
      options: [
        "Data Backup Management System",
        "Database Management System",
        "Digital Base Management Software",
        "Data Binary Management System"
      ],
      correctAnswer: 1,
      explanation: "DBMS stands for Database Management System, software used to manage databases.",
    },
    {
      question: "Which SQL command is used to retrieve data from a table?",
      options: ["INSERT", "UPDATE", "SELECT", "DELETE"],
      correctAnswer: 2,
      explanation: "SELECT retrieves records from one or more database tables.",
    },
    {
      question: "Which key uniquely identifies each record in a table?",
      options: ["Foreign key", "Primary key", "Alternate key", "Composite attribute"],
      correctAnswer: 1,
      explanation: "A primary key uniquely identifies each row in a table and cannot contain NULL values.",
    },
    {
      question: "Which SQL command removes all rows from a table while keeping its structure?",
      options: ["DROP", "DELETE DATABASE", "TRUNCATE", "REMOVE"],
      correctAnswer: 2,
      explanation: "TRUNCATE removes all rows from a table while retaining the table structure.",
    },
    {
      question: "What is normalization in DBMS?",
      options: [
        "Increasing duplicate data",
        "Organizing data to reduce redundancy",
        "Deleting all database tables",
        "Converting tables into files"
      ],
      correctAnswer: 1,
      explanation: "Normalization organizes database tables to reduce unnecessary duplication and improve data integrity.",
    },
    {
      question: "Which SQL clause is used to filter groups after GROUP BY?",
      options: ["WHERE", "ORDER BY", "HAVING", "DISTINCT"],
      correctAnswer: 2,
      explanation: "HAVING filters groups created by GROUP BY, often using aggregate conditions.",
    },
    {
      question: "What is a foreign key?",
      options: [
        "A key that encrypts the database",
        "A field that references a key in another or the same table",
        "A key that must always contain unique values",
        "A key used only for sorting"
      ],
      correctAnswer: 1,
      explanation: "A foreign key references a candidate key, commonly a primary key, and helps maintain referential integrity.",
    },
    {
      question: "Which ACID property ensures that a transaction is completed entirely or not at all?",
      options: ["Consistency", "Isolation", "Durability", "Atomicity"],
      correctAnswer: 3,
      explanation: "Atomicity ensures that all operations in a transaction succeed together or are rolled back.",
    },
    {
      question: "Which JOIN returns only rows with matching values in both tables?",
      options: ["LEFT JOIN", "RIGHT JOIN", "INNER JOIN", "FULL OUTER JOIN"],
      correctAnswer: 2,
      explanation: "INNER JOIN returns rows where the join condition matches in both tables.",
    },
    {
      question: "Which normal form primarily eliminates partial dependency on a composite candidate key?",
      options: ["1NF", "2NF", "3NF", "BCNF"],
      correctAnswer: 1,
      explanation: "Second Normal Form requires 1NF and eliminates partial dependencies of non-prime attributes on candidate keys.",
    },
  ],

  // ==========================================
  // 5. DATA STRUCTURES MOCK TEST - 10 QUESTIONS
  // ==========================================
  "Data Structures": [
    {
      question: "Which data structure follows the LIFO principle?",
      options: ["Queue", "Stack", "Linked List", "Tree"],
      correctAnswer: 1,
      explanation: "A stack follows Last In, First Out, meaning the last inserted element is removed first.",
    },
    {
      question: "Which data structure follows the FIFO principle?",
      options: ["Stack", "Tree", "Queue", "Graph"],
      correctAnswer: 2,
      explanation: "A queue follows First In, First Out, meaning the first inserted element is removed first.",
    },
    {
      question: "What is the time complexity of accessing an array element by index?",
      options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
      correctAnswer: 2,
      explanation: "Array elements can be accessed directly by index in constant time, O(1).",
    },
    {
      question: "Which data structure consists of nodes connected using pointers?",
      options: ["Array", "Linked List", "Stack using array", "Matrix"],
      correctAnswer: 1,
      explanation: "A linked list consists of nodes that store data and references to other nodes.",
    },
    {
      question: "Which traversal visits the root node before its left and right subtrees?",
      options: ["Inorder", "Postorder", "Preorder", "Level order"],
      correctAnswer: 2,
      explanation: "Preorder traversal follows Root, Left, Right.",
    },
    {
      question: "What is the average time complexity of searching in a balanced Binary Search Tree?",
      options: ["O(1)", "O(log n)", "O(n)", "O(n squared)"],
      correctAnswer: 1,
      explanation: "A balanced BST has logarithmic height, so search takes O(log n) time on average.",
    },
    {
      question: "Which algorithm uses a divide-and-conquer strategy to sort elements?",
      options: ["Linear Search", "Bubble Sort", "Merge Sort", "Selection Search"],
      correctAnswer: 2,
      explanation: "Merge Sort divides the array into smaller parts, sorts them recursively, and merges them.",
    },
    {
      question: "What is the worst-case time complexity of binary search on a sorted array?",
      options: ["O(n)", "O(log n)", "O(1)", "O(n squared)"],
      correctAnswer: 1,
      explanation: "Binary search repeatedly halves the search range, giving O(log n) worst-case time.",
    },
    {
      question: "Which collision resolution technique searches for the next available slot sequentially?",
      options: ["Chaining", "Linear Probing", "Binary Search", "Tree Traversal"],
      correctAnswer: 1,
      explanation: "Linear probing checks consecutive hash table positions until an empty slot is found.",
    },
    {
      question: "Which data structure is commonly used to implement a priority queue efficiently?",
      options: ["Heap", "Stack", "Simple Array only", "Circular Linked List only"],
      correctAnswer: 0,
      explanation: "A binary heap supports efficient insertion and removal of the highest- or lowest-priority element.",
    },
  ],

  // ==========================================
  // 6. OPERATING SYSTEMS MOCK TEST - 10 QUESTIONS
  // ==========================================
  "Operating Systems": [
    {
      question: "What is the main purpose of an operating system?",
      options: [
        "To design websites",
        "To manage computer hardware and software resources",
        "To create programming languages",
        "To manufacture processors"
      ],
      correctAnswer: 1,
      explanation: "An operating system manages hardware resources and provides services for applications.",
    },
    {
      question: "What is a process?",
      options: [
        "A program stored on disk only",
        "A program currently in execution",
        "A hardware device",
        "A type of database"
      ],
      correctAnswer: 1,
      explanation: "A process is a program in execution, along with its associated state and resources.",
    },
    {
      question: "Which scheduling algorithm executes processes in arrival order?",
      options: ["Round Robin", "Shortest Job First", "FCFS", "Priority Scheduling"],
      correctAnswer: 2,
      explanation: "First Come First Served schedules processes in the order they arrive.",
    },
    {
      question: "Which scheduling algorithm uses a fixed time quantum?",
      options: ["FCFS", "Round Robin", "Shortest Job First", "Priority Scheduling"],
      correctAnswer: 1,
      explanation: "Round Robin gives each process a fixed time quantum in a cyclic order.",
    },
    {
      question: "What is a deadlock?",
      options: [
        "A process finishing successfully",
        "A condition where processes wait indefinitely for resources held by one another",
        "A computer shutting down normally",
        "A process using no memory"
      ],
      correctAnswer: 1,
      explanation: "Deadlock occurs when processes are stuck waiting for resources that cannot be released because of their mutual dependencies.",
    },
    {
      question: "Which memory management technique divides memory into fixed-size blocks?",
      options: ["Segmentation", "Paging", "Compaction", "Spooling"],
      correctAnswer: 1,
      explanation: "Paging divides virtual memory into fixed-size pages and physical memory into frames.",
    },
    {
      question: "What is a context switch?",
      options: [
        "Changing the programming language",
        "Switching the CPU from one process or thread to another",
        "Deleting a process",
        "Increasing RAM size"
      ],
      correctAnswer: 1,
      explanation: "A context switch saves the state of the current process or thread and restores the state of another.",
    },
    {
      question: "Which of the following is one of the four necessary conditions for deadlock?",
      options: [
        "Preemption",
        "Mutual exclusion",
        "Unlimited resources",
        "Process termination"
      ],
      correctAnswer: 1,
      explanation: "Mutual exclusion is one of the four Coffman conditions required for deadlock.",
    },
    {
      question: "What is the purpose of a semaphore in operating systems?",
      options: [
        "To increase CPU speed",
        "To synchronize processes and control access to shared resources",
        "To permanently store files",
        "To replace the operating system"
      ],
      correctAnswer: 1,
      explanation: "A semaphore is a synchronization mechanism used to coordinate processes or threads accessing shared resources.",
    },
    {
      question: "What is thrashing in an operating system?",
      options: [
        "Excessive paging that reduces system performance",
        "A process completing quickly",
        "A CPU running at maximum frequency",
        "A file being deleted repeatedly"
      ],
      correctAnswer: 0,
      explanation: "Thrashing occurs when excessive page faults cause the system to spend more time swapping pages than executing processes.",
    },
  ],
};

module.exports = mockQuestions;
