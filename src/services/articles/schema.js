import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ArticleSchema = new Schema(
  {
    headLine: { type: String, required: true },
    subHead: { type: String, required: true },
    content: { type: String, required: true },
    category: {
      name: { type: String, required: true },
      img: String,
    },
    authors: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Author",
      },
    ],
    cover: String,
    reviews: [
      {
        text: { type: String, required: true },
        user: { type: String, required: true },
      },
    ],
  },

  { timestamps: true }
);

ArticleSchema.post("validate", function (error, doc, next) {
  if (error) {
    error.errorList = error.errors;
    error.httpStatusCode = 400;
    next(error);
  } else {
    next();
  }
});

ArticleSchema.static("findArticleWithAuthors", async function (articleID) {
  const article = await this.findOne({ _id: articleID }).populate("authors");
  return article;
});

ArticleSchema.static("findArticlesWithAuthors", async function (query) {
  const total = await this.countDocuments(query.criteria);
  const articles = await this.find(query.criteria, query.options.skip)
    .limit(query.options.limit)
    .sort(query.options.sort)
    .populate("authors");

  return { total, articles };
});

export default model("Articles", ArticleSchema);
