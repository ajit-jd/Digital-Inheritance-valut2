const express= require("express")
const app = express();
const path = require("path")
const mysql = require('mysql2/promise');


// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Standard middleware for HTML form submissions
app.use(express.urlencoded({ extended: true })); 
// Standard middleware for JSON data (if used)
app.use(express.json()); 

app.set('view engine', 'ejs')


// MySQL connection
const dbConfig = {
  host: 'localhost',
  user: 'groupProject', // Change as needed
  password: '1234', // Change as needed
  database: 'digital_vault'
};



let db;

async function initDB() {
  db = await mysql.createConnection(dbConfig);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS files (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      type VARCHAR(255),
      salt BLOB NOT NULL,
      iv BLOB NOT NULL,
      data LONGBLOB NOT NULL,
      userId INT,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);
  console.log('Database initialized');
}

// db.connect((err) => {
//     if (err) {
//         console.log('MySQL Error:', err);
//         return;
//     }
//     console.log('✅ MySQL Connected!');
// });

app.get('/',(req,res)=>{
    res.render('index')
})

const loginRouter = require("./Routes/Login/login")
app.use('/',loginRouter)

const dashboardRouter = require("./Routes/dashboard/dashboard")
app.use('/',dashboardRouter)






app.listen(3000,async () => {
  await initDB();
  console.log(`Digital Vault server running at http://localhost:3000`);
});