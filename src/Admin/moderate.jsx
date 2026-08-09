import { requireAdmin } from './auth'; // Import the requireAdmin middleware

const express = require('express');
const router = express.Router();
const db = require('./connect'); 


router.get("/admin/userlist", requireAdmin, (req, res) => {
  // Your code for handling the request
});


router.get("/admin/postlist", requireAdmin, (req, res) => {
  // Your code for handling the request
});


router.get("/admin/manage", requireAdmin, (req, res) => {
  // Your code for handling the request
});