import express from 'express';
import mongoose from "mongoose";
import {loginValidation, postCreateValidation, registerValidation} from './validation.js'
import {PostController, UserController} from "./controllers/index.js";
import multer from 'multer'
import {handleValidationErrors, checkAuth} from "./utils/index.js";


mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('OK'))
    .catch((err) => console.log('Error', err))
const app = express()
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    fillName: (_, file, cb) => {
        cb(null, file.originalname)
    },
})
const upload = multer({storage})
app.use(express.json())
app.use('/uploads', express.static('uploads'))
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    })
})
app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, handleValidationErrors, PostController.update)

app.listen(process.env.PORT || 4444, (err) => {
    if (err) {
        return console.log(err)
    }

    console.log('Norm')
})