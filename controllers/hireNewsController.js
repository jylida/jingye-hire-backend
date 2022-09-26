const HireNews = require("../model/HireNews");
const getAllHireNews = async (req, res) => {
  let page = 1;
  if (req.query.page) {
    page = parseInt(req.query.page);
  }
  let limit = 10;
  if (req.query.limit) {
    limit = parseInt(req.query.limit);
  }
  const indexStart = (page - 1) * limit;
  const indexEnd = (page) * limit;

  console.log(page, limit);
  const hireNews = await HireNews.find();
  if (!hireNews) {
    return res.status(204).json({
      message: "No hire news found",
    });
  }
  const totalPages = Math.ceil(hireNews.length/limit);
  res.json({totalPages, news: hireNews.slice(indexStart, indexEnd)});
};

const createNewHireNews = async (req, res) => {
  const { title, createDate, updateDate, content, author, editor } = req.body;
  if (!(title && createDate && content && author)) {
    return res.status(400).json({
      message: "title, createDate, content, and author are all required!",
    });
  }
  try {
    const result = await HireNews.create({
      title,
      createDate,
      updateDate,
      content,
      author,
      editor,
    });
    res.status(201).json(result);
  } catch (err) {
    return res.json({
      message: err.message,
    });
  }
};
const updateHireNews = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({
      message: "ID parameter is required!",
    });
  }
  const hireNews = await HireNews.findOne({ _id: req.body.id }).exec();
  if (!hireNews) {
    return res
      .status(204)
      .json({ message: `No news matches ID ${req.body.id}` });
  }
  if (req.body?.title) {
    hireNews.title = req.body.title;
  }
  if (req.body?.updateDate) {
    hireNews.updateDate = req.body.updateDate;
  }
  if (req.body?.content) {
    hireNews.content = req.body.content;
  }
  if (req.body?.author) {
    hireNews.author = req.body.author;
  }
  if (req.body?.editor) {
    hireNews.editor = req.body.editor;
  }
  const result = await hireNews.save();
  res.status(201).json(result);
};
const deleteHireNews = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({
      message: "News ID required!",
    });
  }
  const hireNews = await HireNews.findOne({ _id: req.body.id }).exec();
  if (!hireNews) {
    return res
      .status(400)
      .json({ message: `News ID ${req.body.id} not found!` });
  }
  res.json(hireNews);
};
const getOneHireNews = async (req, res) => {
  if (!req?.params?.id) {
    res.status(204).json({
      message: "Parameter 'id' required!",
    });
  }
  const hireNews = await HireNews.findOne({ _id: req.params.id });
  if (!hireNews) {
    return res.status(400).json({
      message: `ID ${req.params.id} did not found`,
    });
  }
  res.json({ hireNews });
};

module.exports = {
  getAllHireNews,
  createNewHireNews,
  updateHireNews,
  deleteHireNews,
  getOneHireNews,
};
