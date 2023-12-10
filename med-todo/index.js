const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const TodoTask = require("./models/TodoTask");

app.use("/static", express.static("public"));
app.use(express.urlencoded({ extended: true }));
dotenv.config();

// Connection to the database
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true })
    .then(() => {
        console.log("Connected to the database!");
    })
    .catch((error) => {
        console.error("Error connecting to the database: " + error);
    });

// View engine configuration
app.set("view engine", "ejs");





// GET METHOD
app.get("/", async (req, res) => {
    try {
        const tasks = await TodoTask.find({});
        res.render("todo.ejs", { todoTasks: tasks });
    } catch (err) {
        console.error("Error fetching tasks: " + err);
        res.render("todo.ejs", { todoTasks: [] }); // Handle the error by rendering an empty list or an error message
    }
});



//POST METHOD
app.post('/',async (req, res) => {
    const todoTask = new TodoTask({
    content: req.body.content
        });
    try {
        await todoTask.save();
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
});



// UPDATE
app.route("/edit/:id")
    .get(async (req, res) => {
        const id = req.params.id;
        try {
            const tasks = await TodoTask.find({});
            res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
        } catch (error) {
            console.error(error);
            res.status(500).send("An error occurred");
        }
    })
    .post(async (req, res) => {
        const id = req.params.id;
        try {
            await TodoTask.findByIdAndUpdate(id, { content: req.body.content });
            res.redirect("/");
        } catch (error) {
            console.error(error);
            res.status(500).send("An error occurred");
        }
});

// DELETE
app.route("/remove/:id").get(async (req, res) => {
    const id = req.params.id;
    try {
        await TodoTask.findByIdAndRemove(id);
        res.redirect("/");
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
    }
});





// Start the server
app.listen(3000, () => {
    console.log("Server Up and running");
});
