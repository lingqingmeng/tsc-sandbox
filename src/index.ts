import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';


interface ApiResponse {
  message: string;
  timestamp: Date;
}

interface JokeResponse {
  id: string;
  joke: string;
  status: number;
}


// Dìngyì yīgè fàn xíng jiēkǒu, qízhōng T shì fàn xíng lèixíng cānshù
// 定义一个泛型接口，其中T是泛型类型参数
interface CustomType<T> {
  data: T;
  process: (input: T) => T;
}
 
// 实现CustomType接口的一个具体类型
class ConcreteCustomType<T> implements CustomType<T> {
  data: T;
 
  constructor(initialData: T) {
    this.data = initialData;
  }
 
  process(input: T): T {
    // 这里可以实现具体的处理逻辑
    // 例如，对于字符串，可以返回其长度
    if (typeof input === 'string') {
      return input + " word" as unknown as T;
      // return (input.length).toString() as unknown as T;
    }
    // 对于其他类型，可以直接返回input
    return input;
  }
}
 
// 使用ConcreteCustomType类
const stringProcessor = new ConcreteCustomType<string>("Loading... Hello, World!");
console.log(stringProcessor.process(stringProcessor.data));  // 输出: "Hello, World!"的长度，即 "12"
 
const numberProcessor = new ConcreteCustomType<number>(42);
console.log(numberProcessor.process(numberProcessor.data));  // 输出: 42


// Create express app
const app = express()
const port = process.env.port || 3000;
const contentDir = path.join(__dirname, 'content');
app.use(bodyParser.json());


// Ensure the content directory exists
fs.ensureDirSync(contentDir);

// Generate a unique ID
const generateId = (): string => {
  return uuidv4();
};

// Simple Log
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
})

// Async route to fetch a joke from an external API
app.get('/joke', async (req: Request, res: Response<ApiResponse>) => {
  try {
    const response = await axios.get<JokeResponse>('https://icanhazdadjoke.com/', {
      headers: { Accept: 'application/json' }
    });
    
    const apiResponse: ApiResponse = {
      message: response.data.joke,
      timestamp: new Date(),
    };
    res.json(apiResponse);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching joke', timestamp: new Date() });
  }
});

// Route to create a new email
app.post('/create-email', async (req: Request, res: Response) => {
  const { subject, content, recipient, sender_email_address } = req.body;

  if (!subject || !content || !recipient || !sender_email_address) {
    return res.status(400).send('All fields are required');
  }

  const id = generateId();
  const email = { id, subject, content, recipient, sender_email_address };
  const filePath = path.join(contentDir, `${id}.json`);

  try {
    await fs.writeJson(filePath, email);
    res.status(201).send(`Email with ID ${id} created successfully`);
  } catch (error) {
    res.status(500).send('Error creating email');
  }
});

// Route to delete an email by subject or ID
app.delete('/delete-email', async (req: Request, res: Response) => {
  const { id, subject } = req.body;

  if (!id && !subject) {
    return res.status(400).send('ID or subject is required');
  }

  try {
    const files = await fs.readdir(contentDir);

    for (const file of files) {
      const filePath = path.join(contentDir, file);
      const email = await fs.readJson(filePath);

      if (email.id === id || email.subject === subject) {
        await fs.remove(filePath);
        return res.status(200).send(`Email with ${id ? `ID ${id}` : `subject ${subject}`} deleted successfully`);
      }
    }

    res.status(404).send('Email not found');
  } catch (error) {
    res.status(500).send('Error deleting email');
  }
});


// Sample route with type-safe request and response
app.get('/', (req: Request, res: Response<ApiResponse>) => {
  const response: ApiResponse = {
    message: 'Hello, TypeScript with Node.js!',
    timestamp: new Date(),
  };
  res.json(response);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});