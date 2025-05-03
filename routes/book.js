// const express = require('express');
// const Book = require('../models/book');
// const Author = require('../models/author');
// const auth = require('../middleware/authMiddleware');
// const { check, validationResult } = require('express-validator');
// const router = express.Router();

// // Buat buku baru
// router.post('/', auth, async (req, res) => {
//     try {
//         const { author_id, title, description } = req.body;

//         if (!author_id || !title || !description) {
//             return res.status(400).json({ error: 'Semua field harus diisi' });
//         }
        
//         const existingAuthor = await Author.findByPk(author_id);
//         if (!existingAuthor) {
//             return res.status(404).json({ error: 'Author tidak ditemukan' });
//         }
        
//         const newBook = await Book.create({ author_id, title, description });
//         res.status(201).json(newBook);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // Dapatkan semua buku menggunakan pagination
// router.get('/', auth, async (req, res) => {
//     try {
//         const limit = parseInt(req.query.limit) || 10;
//         const page = parseInt(req.query.page) || 1;
//         const offset = (page - 1) * limit;
        
//         const books = await Book.findAndCountAll({
//             limit,
//             offset,
//             order: [['createdAt', 'DESC']]
//         });

//         res.json({
//             total: books.count,
//             pages: Math.ceil(books.count / limit),
//             currentPage: page,
//             data: books.rows
//         });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // Dapatkan buku berdasarkan ID
// router.get('/:id', auth, async (req, res) => {
//     try {
//         const book = await Book.findByPk(req.params.id);
//         if (!book) return res.status(404).json({ error: 'Buku tidak ditemukan' });
//         res.json(book);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // Update buku
// router.put('/:id', auth, async (req, res) => {
//     try {
//         const book = await Book.findByPk(req.params.id);
//         if (!book) return res.status(404).json({ error: 'Buku tidak ditemukan' });
        
//         await book.update(req.body);
//         res.json(book);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // Hapus buku
// router.delete('/:id', auth, async (req, res) => {
//     try {
//         const book = await Book.findByPk(req.params.id);
//         if (!book) return res.status(404).json({ error: 'Buku tidak ditemukan' });
        
//         await book.destroy();
//         res.json({ message: 'Buku berhasil dihapus' });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // Create book
// // router.post('/', auth, async (req, res) => {
// //     const { title, description, authorId } = req.body;
// //     const book = await Book.create({ title, description, AuthorId: authorId });
// //     res.json(book);
// //   });

// // // Get all books with pagination
// // router.get('/', auth, async (req, res) => {
// //     const limit = parseInt(req.query.limit) || 10;
// //     const page = parseInt(req.query.page) || 1;
  
// //     const books = await Book.findAndCountAll({
// //       include: Author,
// //       limit,
// //       offset: (page - 1) * limit
// //     });
  
// //     res.json({
// //       total: books.count,
// //       pages: Math.ceil(books.count / limit),
// //       data: books.rows
// //     });
// //   });

// module.exports = router;


const express = require('express');
const { check, validationResult } = require('express-validator');
const Book = require('../models/book');
const Author = require('../models/author');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// 📘 Create a new book
router.post(
    '/',
    auth,
    [
        check('author_id').notEmpty().withMessage('author_id is required'),
        check('title').notEmpty().withMessage('Title is required'),
        check('description').notEmpty().withMessage('Description is required'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        try {
            const { author_id, title, description } = req.body;

            const author = await Author.findByPk(author_id);
            if (!author) return res.status(404).json({ error: 'Author not found' });

            const newBook = await Book.create({ author_id, title, description });
            res.status(201).json(newBook);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

// 📚 Get all books (paginated) with author info
router.get('/', auth, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const offset = (page - 1) * limit;

        const books = await Book.findAndCountAll({
            include: [{ model: Author, attributes: ['id', 'name', 'email'] }],
            limit,
            offset,
            order: [['createdAt', 'DESC']],
        });

        res.json({
            total: books.count,
            pages: Math.ceil(books.count / limit),
            currentPage: page,
            data: books.rows,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 📖 Get book by ID (with author)
router.get('/:id', auth, async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id, {
            include: [{ model: Author, attributes: ['id', 'name', 'email'] }],
        });

        if (!book) return res.status(404).json({ error: 'Book not found' });

        res.json(book);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ✏️ Update book by ID
router.put(
    '/:id',
    auth,
    [
        check('author_id').notEmpty().withMessage('author_id is required'),
        check('title').notEmpty().withMessage('Title is required'),
        check('description').notEmpty().withMessage('Description is required'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        try {
            const book = await Book.findByPk(req.params.id);
            if (!book) return res.status(404).json({ error: 'Book not found' });

            const { author_id, title, description } = req.body;

            const author = await Author.findByPk(author_id);
            if (!author) return res.status(404).json({ error: 'Author not found' });

            await book.update({ author_id, title, description });

            res.json(book);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
);

// 🗑️ Delete book
router.delete('/:id', auth, async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) return res.status(404).json({ error: 'Book not found' });

        await book.destroy();
        res.json({ message: 'Book deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
