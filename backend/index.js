require('dotenv').config();

const config = require('./config.json')
const mongoose = require('mongoose');
mongoose.set('debug', true);

mongoose.connect(config.connectionString)

const express = require('express');
const cors = require('cors');
const app = express();

const jwt = require('jsonwebtoken');
const {generateToken} = require('./util.js');

app.use(express.json());

const User = require('./models/user_model.js');
const Note = require('./models/note_model.js');

app.use(
    cors({
        origin:"*"
    })
)

app.get("/",(req,res)=>{
    res.json({message:"API is working!"});
});

{/* Create Account */}
app.post("/create-account", async (req, res)=> {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const isUser = await User.findOne({ email });
    if (isUser) {
        return res.status(400).json({
            message: "User already exists",
            error: true
        });
    }

    const user = new User({ fullName, email, password });
    let savedUser;
    try {
        savedUser = await user.save();
    } catch (err) {
        console.error("Error saving user:", err);
        return res.status(500).json({ message: "Error creating user", error: true });
    }

    if (!process.env.ACCESS_TOKEN_SECRET) {
        return res.status(500).json({ message: "Missing JWT token secret", error: true });
    }

    let accessToken;
    try {
        accessToken = jwt.sign(
            { userId: savedUser._id, email: savedUser.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '3600m' }
        );
    } catch (err) {
        console.error("Error signing token:", err);
        return res.status(500).json({ message: "Error signing token", error: true });
    }

    return res.status(201).json({
        error: false,
        user: savedUser,
        accessToken,
        message: "User created successfully"
    });
});

{/* Login */}
app.post("/login", async (req,res)=> {
    const {email, password} = req.body;

    if(!email || !password) {
        return res.status(400).json({message: "Email and password are required"});
    }

    const userInfo = await User.findOne({ email });
    if(!userInfo) {
        return res.status(400).json({message: "User does not exist", error: true});
    }

    if(userInfo.password !== password) {
        return res.status(400).json({message: "Invalid credentials", error: true});
    }

    const accessToken = jwt.sign(
        {userId: userInfo._id, email: userInfo.email}, 
        process.env.ACCESS_TOKEN_SECRET, 
        {expiresIn: '3600m'}
    );

    return res.status(200).json({
        error: false,
        user: userInfo,
        accessToken,
        message: "User logged in successfully"
    });
})

{/* Create Note */}
app.post("/create-note", generateToken, async (req, res)=> {
    const {title, content, tags} = req.body;
    if(!title || !content) {
        return res.status(400).json({message: "Title and content are required", error: true});
    }

    const user = req.user;

    if(!user) {
        return res.status(401).json({message: "Unauthorized", error: true});
    }

    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user.userId
        });

        await note.save();
        return res.status(201).json({
            message: "Note created successfully", 
            error: false, 
            note
        });
    }
    catch (err) {
        console.error("Error creating note:", err);
        return res.status(500).json({ 
            message: "Error creating note", 
            error: true 
        });
    }
})

{/* Edit Notes */}
app.put("/edit-note/:id", generateToken, async (req, res) => {
    const noteId = req.params.id
    const { title, content, tags, isPinned } = req.body;
    const user = req.user;
    if(!user) {
        return res.status(401).json({message: "Unauthorized", error: true});
    }
    if(!title || !content) {
        return res.status(400).json({message: "Title and content are required", error: true});
    }
    try {
        const note = await Note.findById(noteId);
        if(!note) {
            return res.status(404).json({message: "Note not found", error: true});
        }
        if(note.userId !== user.userId) {
            return res.status(403).json({message: "Forbidden", error: true});
        }
        note.title = title;
        note.content = content;
        note.tags = tags || [];
        note.isPinned = isPinned || false;
        await note.save();
        return res.status(200).json({message: "Note updated successfully", error: false, note});
    } catch (err) {
        console.error("Error updating note:", err);
        return res.status(500).json({message: "Error updating note", error: true});
    }
})

{/* Get Notes */}
app.get("/notes", generateToken, async (req, res)=> {
    const user = req.user;
    if(!user) {
        return res.status(401).json({message: "Unauthorized", error: true});
    }
    try {
        const notes = await Note.find({userId: user.userId}).sort({isPinned: -1});
        return res.status(200).json({notes, error: false});
    } catch (err) {
        console.error("Error fetching notes:", err);
        return res.status(500).json({message: "Error fetching notes", error: true});
    }
})

{/* Delete Note */}
app.delete("/delete/:id", generateToken, async (req, res)=> {
    const noteId = req.params.id;
    const user = req.user;
    if(!user) {
        return res.status(401).json({message: "Unauthorized", error: true});
    }
    try {
        const note = await Note.findById(noteId);
        if(!note) {
            return res.status(404).json({message: "Note not found", error: true});
        }
        if(note.userId !== user.userId) {
            return res.status(403).json({message: "Forbidden", error: true});
        }

        await Note.findByIdAndDelete(noteId);
        return res.status(200).json({message: "Note deleted successfully", error: false});
    } catch (err) {
        console.error("Error deleting note:", err);
        return res.status(500).json({message: "Error deleting note", error: true});
    }
});

{/*Update isPinned Value*/}
app.put("/pin-note/:id", generateToken, async (req, res) => {
    const noteId = req.params.id;
    const { isPinned } = req.body;
    const user = req.user;
    if(!user) {
        return res.status(401).json({message: "Unauthorized", error: true});
    }
    try {
        const note = await Note.findById(noteId);
        if(!note) {
            return res.status(404).json({message: "Note not found", error: true});
        }
        if(note.userId !== user.userId) {
            return res.status(403).json({message: "Forbidden", error: true});
        }
        note.isPinned = isPinned;
        await note.save();
        return res.status(200).json({message: "Note pinned status updated successfully", error: false, note});
    } catch (err) {
        console.error("Error updating note pinned status:", err);
        return res.status(500).json({message: "Error updating note pinned status", error: true});
    }
})

{/* Get User */}
app.get("/user", generateToken, async (req, res) => {
    const user = req.user;
    if(!user) {
        return res.status(401).json({message: "Unauthorized", error: true});
    }
    try {
        const userData = await User.findById(user.userId);
        if(!userData) {
            return res.status(404).json({message: "User not found", error: true});
        }
        return res.status(200).json({
            user: {
                fullName: userData.fullName, 
                email: userData.email, 
                "_id": userData._id, 
                "createdOn": userData.createdOn
            }, 
            error: false
        });
    } catch (err) {
        console.error("Error fetching user:", err);
        return res.status(500).json({message: "Error fetching user", error: true});
    }
})

app.listen(8000, () => {
    console.log("Server is running on port 8000");
});

module.exports = app;