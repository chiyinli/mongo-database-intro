const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');
const path = require('path');
const dotenv = require('dotenv');

const app = express();

dotenv.config({ path: './config.env' });

app.use(express.urlencoded());
app.use(express.json());


mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB is connect'))

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));
app.set('view engine', 'hbs');

app.get('/', async (req, res) => {
    try {
        const users = await User.find();
        const selectedUser = await User.findOne({ name: 'chi'});
    
        // res.status(200).json(users);

        res.render('index', {
            data:users,
            dataUser: selectedUser
        })
    
        } catch(error){
        status: error.message

        }
  
});

app.get('/updateUser', async (req, res) => {
    const updateUser = await User.findByIdAndUpdate('5e985d916007370e03c08447',
        {
            name: 'Hugh Boss'
        }
    );

    res.send('User Updated');
});

app.get('/deleteUser', async (re, res) => {
    const deleteUser = await User.findByIdAndRemove('5e985d916007370e03c08447');
    res.send('User Deleted');
});



app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register/user', async (req, res) => {
    console.log(req.body);
    const name = req.body.form_user_name;
    const email = req.body.form_user_email;
    const password = req.body.form_user_password;
    const age = req.body.form_user_age;
    const salary = req.body.form_user_salary;

    try {

    const newUser = await User.create({
        name: name,
        email: email,
        password: password,
        age: age,
        salary: salary
    });

    res.status(201).json(newUser);
    } catch(error) {
        console.log(error.message);
        res.status(400).json({
            statue: error.message
        });
    }
})

app.listen(5000, (req, res) => {
    console.log('server is running on port 5000');
})