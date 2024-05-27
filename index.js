const express = require('express');
var app = express();

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const ejs = require("ejs");
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views'));

const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')

//ensuring that all sensitive information is not accessible in a non-proudction environment
if (process.env.NODE_ENV !== 'production'){
    //dotenv is a module that loads environment variables from an .env file
    require('dotenv').config()
}

app.use(express.urlencoded({extended: false}))
//initializing passport and adding its middleware
app.use(passport.initialize())

app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    //asking if we should resave our session variables if nothing has changed
    resave: false,
    //asking if we want to save an empty value in the session if there is no value
    saveUninitialized: false,
    cookie: { secure: false }
 }))

//manages session data
app.use(passport.session())

const router = require("./routes/route_index.js");
app.use(router);
// IN PROGRESS: Uploading, parsing, and saving excel files -----------

// a lot of this will go into middleware!

//const multer = require('multer');
//const xlsx = require('xlsx');
//const upload = multer({ dest: 'uploads/' });

// // uploading excel files template code
// app.post('/upload', upload.single('file'), async (req, res) => {
//     const workbook = xlsx.readFile(req.file.path);
//     const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//     const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

//     try {
//         for (const item of data) {
//             await connection.query(
//                 // logic goes here!

//                 // EXAMPLE CODE -----
//                 // `INSERT INTO excel_data (task, subtask, uom_labour, labour_quantity, labour_total, uom_material, material_quantity, material_total, complete, value)
//                 // VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//                 // [
//                 //     item.Task,
//                 //     item.Subtask,
//                 //     item['UoM Labour'],
//                 //     item['Labour Quantity'],
//                 //     item['Labour Total'],
//                 //     item['UoM Material'],
//                 //     item['Material Quantity'],
//                 //     item['Material Total'],
//                 //     item.Complete,
//                 //     item.Value,
//                 // ]
//                 // -------------
//             );
//         }
//     } catch (err) {
//         console.error('Error inserting data:', err);
//         res.status(500).json({ error: 'Error inserting data into the database.' });
//     } 
// });
// ------------------------

app.listen(process.env.PORT || 3000, () => console.log('server listening'));
