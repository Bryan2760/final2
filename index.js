
const express = require("express");
const app = express();
const dblib = require("./dblib.js");
const path = require("path");
const multer = require("multer");
const upload = multer();
const { Pool } = require("pg");
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("public"));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.use(express.static("public"));

app.listen(process.env.PORT || 3000, () => {
    console.log("Server started (http://localhost:3000/) !");
});

//home
app.get("/home", async (req, res) => {
  {
    res.render("index");
  }
  });

app.get("/", (req, res) => {
    res.render("index");
});


//get import
app.get("/import", async (req, res) => {
    const totRecs = await dblib.getTotalRecords();
    const book = {
        book_id: "",
        title: "",
        total_pages: "",
        rating: "",
        isbn: "",
        published_date: ""
    };
    res.render("import", {
        type: "get",
        totRecs: totRecs.totRecords,
        book: book
    });
});
// post import
app.post("/import", upload.single('filename'), (req, res) => {
    if (!req.file || Object.keys(req.file).length === 0) {
        message = "Error: Import file not uploaded";
        return res.send(message);
    };
    const buffer = req.file.buffer;
    const lines = buffer.toString().split(/\r?\n/);

    lines.forEach(line => {
        book = line.split(",");
        const sql = "INSERT INTO BOOK(book_id, title, total_pages, rating, isbn, published_date ) VALUES ($1, $2, $3, $4, $5, $6)";
        pool.query(sql, book, (err, result) => {
            if (err) {
                console.log(`Insert Error.  Error message: ${err.message}`);
            } else {
                console.log(`Inserted successfully`);
            }
        });
    });
    message = `Processing Complete - Processed ${lines.length} records`;
    res.send(message);
});

//get sum
app.get("/sum", (req, res) => {
    res.render("sum");
});
// post sum
app.post("/sum", (req, res) => {
    res.render("sum");
    console.log("The Sum of the number from 1 to 10 incremented by 2 is 25");
    
});