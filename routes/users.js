const express = require('express');
const router = express.Router();
const User = require('../models/user');
const auth = require('../middleware/authMiddleware');

// Buat pengguna baru (dilindungi, non-auth harus menggunakan /register)
router.post('/', auth, async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Semua field harus diisi' });
        }
        
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'Email sudah digunakan' });
        }
        
        const newUser = await User.create({ name, email, password });
        const { password: _, ...userData } = newUser.toJSON();
        res.status(201).json(userData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
  
// Dapatkan semua pengguna
router.get('/', auth, async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
  
// Dapatkan pengguna tunggal
router.get('/:id', auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password'] }
        });
        if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
  
// Update user
router.put('/:id', auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });
    
        await user.update(req.body);
        const { password: _, ...updatedUser } = user.toJSON();
        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
  
// Delete user
router.delete('/:id', auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });
    
        await user.destroy();
        res.json({ message: 'User berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
  
  module.exports = router;