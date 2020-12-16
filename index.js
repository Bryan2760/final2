// const express = require("express");
// const app = express();
// const dblib = require("./dblib.js");
// const path = require("path");
// const multer = require("multer");
// const upload = multer();
// const { Pool } = require('pg');
// const { response } = require("express");



// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: {
//     rejectUnauthorized: false
//   }
// });

// require('dotenv').config()


// app.set("view engine", "ejs");
// app.set("views", __dirname + "/views");
// app.use(express.static(path.join(__dirname, "public")));
// app.use(express.urlencoded({ extended: false }));

// app.listen(process.env.PORT || 3000, function () {
//     console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
//   });


// //home
// app.get("/home", async (req, res) => {
// {
//   res.render("index");
// }
// });


// //Sum of series
// app.get("/sum", (req, res) => {

//   res.render("sum", {
//     type: "get",
//     num1: "",
//     num2: "",
//     incr: ""
//   })
// });

// app.post("/sum", (req, res) => {
//   console.log(req.body);
//   let numbers = [];
//   var num1= req.body.num1;
//   var num2= req.body.num2;
//   var incr= req.body.incr;
//   var i= 0;
//   var errorMessage= "Ending number must be less than starting number"


//   for ( i = num1; i <= num2; i++) {

//       if(incr > 1) {


//           numbers.push(+incr);
//           console.log(num1)
//           var sum = numbers.reduce(function(a,b){
//             return a + b;
//           })
//           console.log(sum);
//       } else if (num2 < num1) {

//         msg= errorMessage
        
          
//       } else {

//         numbers.push (i++);

//       }
      
      
//   }


//   res.render("sum", {
//     type: "post",
//     numbers: numbers,
//     num1: num1,
//     num2: num2,
//     incr: incr,
//     i: i,
//     sum: sum,
//     msg: errorMessage
    
//   })
// })


// //import

// app.get("/import", async (req, res) => {
//   const totRecs = await dblib.getTotalRecords();
//   const book = {

//     book_id: "",
//     title: "",
//     total_pages: "",
//     rating: "",
//     isbn: "",
//     published_date: ""

//   };

//   res.render("import", {
//     type: "get",
//     totRecs: totRecs.totRecords,
//     book: book
//   });
// });

// // POST /import
// app.post("/import", upload.single('filename'), async (req, res) => {

//   (async () => {
//     var numInserted = 0;
//     var numFailed = 0;
//     var errorMessage = "";
//     const buffer = req.file.buffer;
//     const lines = buffer.toString().split(/\r?\n/);



//     for (line of lines) {
      
//       const book = line.split(",");
//       console.log(book);
      
//       console.log("Wait for Result")

//       const result = await dblib.importBooks(book);

//       if (result.trans === "success") {

//         numInserted++;

//       } else {

//         numFailed++;

//         errorMessage += `${result.msg} \r\n`;
//       };
//     };

//     console.log("Import Summary");
//     console.log(`Records processed: ${numInserted + numFailed}`);
//     console.log(`Records successfully inserted: ${numInserted}`);
//     console.log(`Records with insertion errors: ${numFailed}`);

//     if (numFailed > 0) {

//       console.log("Error Details:");

//       console.log(errorMessage);
//     };

//     const totRecs = await dblib.getTotalRecords();

//     res.render("import", {
//       type: "POST",
//       totRecs: totRecs.totRecords,
//       numFailed: numFailed,
//       numInserted: numInserted,
//       errorMessage: errorMessage
//     })

//   })()

// });

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