import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import 'dotenv/config'


const app = express();
const PORT = 3000;

app.use(cors()); // Allow frontend access
app.use(express.static("public")); // Serve frontend files
// const uploadFolder = "./uploads"; // Directory to store Excel file
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

// Student Schema
const studentSchema = new mongoose.Schema({
    "AY YR": Number,
    "Guardian ID": Number,
    "St ID": Number,
    "Student ID": Number,
    "Student Type": String,
    "School Name": String,
    "Brand Name": String,
    "Board Name": String,
    "Course Name": String,
    "Stream Name": String,
    "Shift Name": String,
    "Grade Name": String,
    "House": String,
    "Student EduLearn ENR": String,
    "EduLearn Application No": Object,
    "Student New ENR": String,
    "Student First Name": String,
    "Student Last Name": String,
    "Student DOB": String,
    "Guardians Relationship": String,
    "Guardians Global No": String,
    "Guardians first_name": String,
    "Guardians Mobile": Number, // Converted from NumberLong to String
    "Guardians Email": String,
    "One Time password": String
});

const Student = mongoose.model('StudentData', studentSchema, 'StudentData');



app.post('/byENR', async (req, res) => {
    try {
        const { result } = req.body;
        console.log(result);
        let query = {};

        if (result?.enNumber) {
            query = { "Student New ENR": result.enNumber };
        }
        else if (result?.appno) {
            query = { "EduLearn Application No": { "": result.appno } };
        }
        else if (result?.enrno) {
            query = { "Student EduLearn ENR": result.enrno };
        }
        else if (result?.email) {
            query = { "Guardians Email": result.email };
        }
        else if (result?.phone) {
            query = { "Guardians Mobile": parseInt(result.phone) };
        }
        else {
            query = { "Student First Name": result.name };
        }


        const data = await Student.find(query);

        if (data.length > 0) {
            res.json(data);
        } else {
            res.status(404).json({ message: "Student not found" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
