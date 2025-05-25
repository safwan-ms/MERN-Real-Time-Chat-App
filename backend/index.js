import express from "express";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT;
console.log(PORT);
const app = express();

app.listen(PORT, () => console.log(`Server is listening to ${PORT}`));
