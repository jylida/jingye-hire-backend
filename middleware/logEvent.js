const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
const { v4: uuid } = require("uuid");
const { format } = require("date-fns");

const logEvent = async (
  message,
  fileName,
  folderName = path.join(__dirname, "..", "eventLogs")
) => {
  const dateTime = format(new Date(), "yyyyMMdd\tHH:mm:ss");
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  //create fold if not exists
  if (!fs.existsSync(folderName)) {
    await fsPromises.mkdir(folderName);
  }

  const filePath = path.join(folderName, fileName);
  try {
    await fsPromises.appendFile(filePath, logItem);
  } catch (err) {
    console.error(err);
  }
};

const logger = (req, res, next) => {
  console.log(req.method, req.url);
  const logItem = `${req.method}\t${req.url}`;
  logEvent(logItem, "eventLog.txt");
  next();
};

module.exports = { logger, logEvent };
