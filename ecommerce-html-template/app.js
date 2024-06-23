const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const morgan=require("morgan");
const path = require('path');
const {Prohairesis}=require("prohairesis");
const app = express();
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the 'CSS' directory
app.use('/css', express.static(path.join(__dirname, 'CSS')));

// Serve static files from the 'lib' directory
app.use('/lib', express.static(path.join(__dirname, 'lib')));

// images
app.use('/img',express.static(path.join(__dirname,'img')));

//js
app.use('/js',express.static(path.join(__dirname,'js')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/cart',(req,res)=>{
  res.sendFile(path.join(__dirname,'public','cart.html'));
});

app.get('/checkout',(req,res)=>{
  res.sendFile(path.join(__dirname,'public','checkout.html'));
});

app.get('/contact',(req,res)=>{
  res.sendFile(path.join(__dirname,'public','contact.html'));
});

app.get('/my-account',(req,res)=>{
  res.sendFile(path.join(__dirname,'public','my-account.html'));
});

app.get('/product-details',(req,res)=>{
  res.sendFile(path.join(__dirname,'public','product-details.html'));
});

app.get('/product-list',(req,res)=>{
  res.sendFile(path.join(__dirname,'public','product-list.html'));
});

app.get('/registered',(req,res)=>{
  res.sendFile(path.join(__dirname,'public','registered.html'));
});

app.get('/wishlist',(req,res)=>{
  res.sendFile(path.join(__dirname,'public','wishlist'));
})

.use(morgan("dev"))
.use(bodyParser.urlencoded({extended:false}))
.use(bodyParser.json())
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create User schema and model
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  mobile: String,
  password: String,
});
const User = mongoose.model('User', userSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('./views/login', (req, res) => {
  res.sendFile(__dirname + '/views/login.html');
});
function firstName(){
  app.post('/auth/login', async (req, res) => {
    const { fname, lname, email, mno, password, repassword } = req.body;
  
    if (password !== password2) {
      return res.send('Passwords do not match');
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const newUser = new User({
      fname,
      lname,
      email,
      mno,
      password: hashedPassword,
    });
  
    try {
      await newUser.save();
      res.send('User registered successfully');
    } catch (error) {
      res.send('Error registering user');
    }
  });
}
app.post('/auth/registered', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ email: username });
    if (!user) {
      return res.send('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.send('Invalid credentials');
    }

    res.send('User logged in successfully');
  } catch (error) {
    res.send('Error logging in user');
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
