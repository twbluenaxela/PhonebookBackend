const mongoose = require("mongoose");

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]
const databaseName = "phonebookApp";

const url = `mongodb+srv://admin:${password}@cluster0.yjj12od.mongodb.net/${databaseName}?retryWrites=true&w=majority`;
mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name: name,
  number: number,
});


if (process.argv.length < 3) {
  console.log("Current argv length", process.argv.length);
  console.log(
    `Please provide the password as an argument: node mongo.js <password>`
  );
  process.exit(1);
} else if (process.argv.length === 3) {
  Person.find({ important: true }).then((result) => {
    result.forEach((person) => {
      console.log(person);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length > 3 && process.argv.length > 5) {
  person.save().then((result) => {
    console.log(`Added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
}
