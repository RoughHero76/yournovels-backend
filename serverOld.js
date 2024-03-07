import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "./src/Models/userModel.js";
import connectDB from "./src/DataBase/databaseConfig.js"
import Novel from "./src/Models/novels.js";
import cors from 'cors';

dotenv.config({
    path: './.env'
});



connectDB();

const app = express();
const port = process.env.PORT || 6000;

app.use(cors());

app.use(express.json());


mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

});

// Verify Token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

//Home Route
app.get("/", (req, res) => {
    res.send(`Hello server is Up and Running ${process.env.PORT}`)
})


// User registration
app.post('/register', async (req, res) => {
    try {

        const { firstName, lastName, username, email, password, isAdmin, penName, isAuthor } = req.body;

        let existingUser = await User.findOne({ email });
        let existingUsername = await User.findOne({ username })
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        } else if (existingUsername) {
            return res.status(400).json({ message: 'Username is already taken' })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
            isAdmin,
            penName,
            isAuthor
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// User authentication
app.post('/login', async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_TOKEN, {
            expiresIn: process.env.JWT_SECRET_TOKEN_EXPIRY,
        });

        res.status(200).json({ token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.get('/mynovels', verifyToken, async (req, res) => {
    try {
        const { userId } = req;
        console.log(userId);

        const user = await User.findById(userId);

        if (!user || !user.isAuthor) {
            return res.status(401).json({ message: 'You are not author. Please become a author first.' });
        }

        const novels = await Novel.find({ author: userId });

        if (novels.length === 0) {
            return res.status(404).json({ message: 'No novels found. Start Writing!' });
        }

        res.status(202).json({ novels });

    } catch (error) {

        console.error('Error fetching user Noveles: ', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Adding novels
app.post('/novels', verifyToken, async (req, res) => {
    try {
        const { userId } = req;

        const user = await User.findById(userId);

        if (!user || !user.isAuthor) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { title, genre, description } = req.body;

        const novel = new Novel({
            title,
            author: userId,
            genre,
            description
        });

        let existingNovels = await Novel.findOne({ title });

        if (existingNovels) {

            return res.status(400).json({ message: 'Novel with same title already exists' })

        }


        await novel.save();

        res.status(201).json({ message: 'Novel created successfully', novel });
    } catch (error) {
        console.error('Error creating novel:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Adding a chapter to a novel
app.post('/novels/:novelId/chapters', verifyToken, async (req, res) => {
    try {
        const { userId } = req;

        const user = await User.findById(userId);

        if (!user || !user.isAuthor) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { novelId } = req.params;
        const novel = await Novel.findById(novelId);

        // Check if the novel exists
        if (!novel) {
            return res.status(404).json({ message: 'Novel not found' });
        }
        const { title, content } = req.body;
        const chapter = {
            title,
            content
        };

        // Push Chapter to the array
        novel.chapters.push(chapter);


        await novel.save();

        res.status(201).json({ message: 'Chapter added successfully', chapter });
    } catch (error) {
        console.error('Error adding chapter:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});