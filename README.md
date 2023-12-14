# Halendb

[![npm version](https://badge.fury.io/js/halendb.svg)](https://badge.fury.io/js/halendb)

Halendb is a lightweight and flexible database package for Node.js.

## Installation

```bash
npm install halendb
```

## Usage

```ts
const { Database, Schema } = require('halen.db');

// Initialization
const database = new Database({
  provider: 'json',
  path: './database'
});

// Create a schema
const userSchema = Schema.create({
  id: Schema.number().required(),
  data: {
    name: Schema.string().default('unnamed'),
    age: Schema.number().required().min(18)
  }
});

// Create a repository
const userRepository = database.createRepository('users', userSchema);

```

## Methods

```ts
// Create a user
const createdUser = userRepository.create({ 
  id: 1, 
  data: { age: 18 }
});

// Get a user
const getUser = userRepository.get(1);

// Update a user
const updateResult = userRepository.update({
  id: 1,
  data: {
    name: 'John'
  }
});

// Get repository data
const allData = userRepository.data();

// Delete a user
const deleteResult = userRepository.delete(1);
```

# License

This project is licensed under the MIT License - see the LICENSE.md file for details
