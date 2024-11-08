import axios from 'axios';
import jwt from 'jsonwebtoken';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
export const JWT_SECRET = process.env.JWT_SECRET || 'your_very_secret_key';