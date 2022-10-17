import express from 'express';
import mongoose from "mongoose";
import {loginValidation, postCreateValidation, registerValidation} from './validation.js'

import checkAuth from "./utils/checkAuth.js";
import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";


mongoose
    .connect('mongodb+srv://admin:wwwwww@cluster0.gbp6kn3.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('OK'))
    .catch((err) => console.log('Error', err))

const app = express()

app.use(express.json())


app.get('/', (req, res) => {
    res.send('Hello world')
})

app.post('/auth/login', loginValidation, UserController.login)
app.post('/auth/register', registerValidation, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

// app.get('/auth/me', UserController.getAll)
// app.get('/auth/:id', checkAuth, UserController.getOne)
app.post('/posts', checkAuth, postCreateValidation, PostController.create)
// app.delete('/posts', checkAuth, UserController.remove)
// app.patch('/posts', checkAuth, UserController.update)

app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    }

    console.log('Norm')
})