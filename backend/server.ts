import express, { Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGO_URI || ' ')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log(error.message));

interface Student {
  fullName: string;
  age: number;
  college: string;
}

const studentSchema = new mongoose.Schema<Student>({
  fullName: { type: String, required: true },
  age: { type: Number, required: true },
  college: { type: String, required: true },
}, {
  collection: 'studentcollection'
});

const StudentModel = mongoose.model('Student', studentSchema);

app.get('/students', async (req: Request, res: Response) => {
  try {
    const students = await StudentModel.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error });
  }
});

app.post('/submit', async (req: Request, res: Response) => {
  try {
    const { fullName, age, college } = req.body;
    const student = new StudentModel({ fullName, age, college });
    await student.save();
    res.status(200).json({ message: 'Data submitted successfully', student });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error submitting data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
