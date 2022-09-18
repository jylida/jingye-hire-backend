const Employees = require("../model/Employees");
const Employee = require("../model/Employees");
const getAllEmployees = async (req, res) => {
  const employees = await Employee.find();
  if (!employees) {
    return res.status(204).json({
      message: "No employees found",
    });
  }
  res.json({ employees });
};
const createNewEmployee = async (req, res) => {
  const { firstname, lastname } = req.body;
  if (!(firstname && lastname)) {
    return res
      .status(400)
      .json({ message: "first and last names are both required!" });
  }
  try {
    const result = await Employees.create({ firstname, lastname });
    console.log(result);
    res.status(201).json(result);
  } catch (err) {
    return res.json({
      message: err.message,
    });
  }
};
const updateEmployees = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({
      message: "ID parameter is required!",
    });
  }
  const employee = await Employee.findOne({ _id: req.body.id }).exec();
  if (!employee) {
    return res
      .status(204)
      .json({ message: `No employee matches ID ${req.body.id}.` });
  }
  if (req.body?.firstname) {
    employee.firstname = req.body.firstname;
  }
  if (req.body?.lastname) {
    employee.lastname = req.body.lastname;
  }
  const result = await employee.save();
  res.status(201).json(result);
};
const deleteEmployee = async (req, res) => {
  if (!req?.body?.id) {
    return res.status(400).json({
      message: "Employee ID required!",
    });
  }
  const employee = await Employee.findOne({ _id: req.body.id }).exec();
  if (!employee) {
    return res
      .status(400)
      .json({ message: `Employee ID ${req.body.id} not found!` });
  }
  const result = await employee.deleteOne({ _id: req.body.id });
  res.status(200).json(result);
};
const getEmployee = async (req, res) => {
  if (!req?.params?.id) {
    res.status(204).json({
      message: "Parameter 'id' required!",
    });
  }
  const employee = await Employee.findOne({ _id: req.params.id });
  if (!employee) {
    return res.status(400).json({ message: `Id ${req.params.id} not found!` });
  }
  res.json(employee);
};
module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployees,
  deleteEmployee,
  getEmployee,
};
