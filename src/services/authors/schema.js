import mongoose from "mongoose";

const { Schema, model } = mongoose;

const AuthorSchema = new Schema({
  name: String,
  surname: String,
});

export default model("Author", AuthorSchema);
