# How to use

```
npm install --save-dev typescript @babel/core @babel/cli @babel/preset-env
```

```
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "outDir": "dist",
    "strict": true
  }
}
```

```
{
  "presets": ["@babel/preset-env"]
}
```



## Additional Instruction



Sure! Let's create a simple Node.js server using TypeScript that showcases some of TypeScript's advantages, such as type safety, interfaces, and async/await with proper type definitions. We'll use Express for this example.

### 1. Setup

First, make sure you have TypeScript and Express installed. You can initialize a new Node.js project and install the necessary packages using the following commands:

```bash
npm init -y
npm install express --save
npm install --save-dev typescript @types/node @types/express ts-node
```

### 2. Configure TypeScript

Create a `tsconfig.json` file to configure TypeScript:

```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 3. Create the Server

Create a `src` directory and add an `index.ts` file:

```typescript
import express, { Request, Response, NextFunction } from 'express';

// Define an interface for the response
interface ApiResponse {
  message: string;
  timestamp: Date;
}

// Create the Express app
const app = express();
const port = 3000;

// Middleware to log request details
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
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
```

### 4. Build and Run the Server

Add scripts to your `package.json` to build and run the server:

```json
"scripts": {
  "build": "tsc",
  "start": "ts-node src/index.ts"
}
```

Now, you can start the server using:

```bash
npm run serve
```

### Advantages Demonstrated

1. **Type Safety**: The `ApiResponse` interface ensures that the response object always contains the specified properties.
2. **Async/Await with Type Definitions**: If you add any asynchronous functions, TypeScript will provide proper type definitions and checks.
3. **Request and Response Types**: Using `Request` and `Response` from Express with generic types ensures that the request and response objects are properly typed, reducing the chances of runtime errors.

### Example with Async/Await

Let's modify the example to include an async route handler:

```typescript
import express, { Request, Response, NextFunction } from 'express';
import axios from 'axios';

// Define an interface for the response
interface ApiResponse {
  message: string;
  timestamp: Date;
}

interface JokeResponse {
  id: string;
  joke: string;
  status: number;
}

// Create the Express app
const app = express();
const port = 3000;

// Middleware to log request details
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

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
```

In this updated example, we added an async route handler that fetches a joke from an external API and returns it. The use of TypeScript ensures that all data handling is type-safe and well-defined.


<hr/>

## Realziation 

With Typescript, if you use Axios you would use a generic type. 

The difference between `axios` and `fetch` regarding the use of generic types stems from their design and implementation.

### `axios` and TypeScript Generics

`axios` was built with a focus on flexibility and ease of use, particularly for TypeScript users. It leverages TypeScript generics to provide strong typing for both request and response objects, making it easier to work with expected data structures.

Here's an example using `axios` with TypeScript generics:

```typescript
import axios from 'axios';

interface JokeResponse {
  id: string;
  joke: string;
  status: number;
}

const fetchJoke = async () => {
  const response = await axios.get<JokeResponse>('https://icanhazdadjoke.com/', {
    headers: { Accept: 'application/json' }
  });
  console.log(response.data.joke);
};

fetchJoke();
```

In this example, `axios.get<JokeResponse>` specifies that the response data should conform to the `JokeResponse` interface, providing strong typing and better developer experience.

### `fetch` and TypeScript

The native `fetch` API is a low-level API designed to be a minimal and flexible tool for making HTTP requests. It does not natively include TypeScript support or generics, as it is part of the standard web API available in browsers and, as of Node.js 18, in Node.js as well.

When using `fetch` with TypeScript, you typically need to manually assert the types after receiving the response, which provides more flexibility but requires extra steps to ensure type safety.

Here's an example using `fetch` with TypeScript:

```typescript
interface JokeResponse {
  id: string;
  joke: string;
  status: number;
}

const fetchJoke = async () => {
  const response = await fetch('https://icanhazdadjoke.com/', {
    headers: { Accept: 'application/json' }
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data: JokeResponse = await response.json();
  console.log(data.joke);
};

fetchJoke();
```

### Adding Type Safety to `fetch`

To add type safety when using `fetch`, you can create helper functions or use TypeScript type assertions:

```typescript
const fetchJoke = async () => {
  const response = await fetch('https://icanhazdadjoke.com/', {
    headers: { Accept: 'application/json' }
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = (await response.json()) as JokeResponse;
  console.log(data.joke);
};

fetchJoke();
```

By using `as JokeResponse`, you tell TypeScript that you expect the response to match the `JokeResponse` interface. This approach gives you the flexibility of `fetch` while adding type safety manually.


## File Server Instruction 

See: https://www.notion.so/lucia-protocol/Reference-Document-23fec4f381c048c8885f78f7c63e7301?pvs=4

### Conclusion

- **`axios`**: Uses generics to provide strong typing and a better developer experience with TypeScript out of the box.
- **`fetch`**: A lower-level API that does not include built-in TypeScript generics. You need to add type assertions manually to ensure type safety.

Choosing between `axios` and `fetch` depends on your preference for flexibility versus built-in type safety and convenience. If you're comfortable adding type assertions and prefer a minimal API, `fetch` might be the way to go. If you prefer built-in TypeScript support and a more feature-rich library, `axios` is a better choice.