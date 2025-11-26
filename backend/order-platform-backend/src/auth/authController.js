const { v4: uuidv4 } = require('uuid');
const config = require('../../config/env');
const { inMemoryStore } = require('../../config/database');

// Mock JWT signing (use jsonwebtoken in production)
const generateToken = (userId) => {
  return `mock-jwt-${userId}-${Date.now()}`;
};

exports.signup = (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    const userExists = inMemoryStore.users.find(u => u.email === email);
    if (userExists) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const newUser = {
      userId: uuidv4(),
      email,
      name,
      password, // Hash in production
      createdAt: Date.now(),
    };

    inMemoryStore.users.push(newUser);

    res.status(201).json({
      userId: newUser.userId,
      email: newUser.email,
      name: newUser.name,
      token: generateToken(newUser.userId),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = inMemoryStore.users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // In production, use bcrypt to compare passwords
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({
      userId: user.userId,
      email: user.email,
      name: user.name,
      token: generateToken(user.userId),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProfile = (req, res) => {
  try {
    const { userId } = req.params;
    const user = inMemoryStore.users.find(u => u.userId === userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      userId: user.userId,
      email: user.email,
      name: user.name,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};