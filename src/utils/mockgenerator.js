const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

const generateUser = async () => {
  const hashedPassword = await bcrypt.hash("coder123", 10);
  return {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: hashedPassword,
    role: faker.helpers.arrayElement(["user", "admin"]),
    pets: []
  };
};

const generateUsers = async (count = 50) => {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push(await generateUser());
  }
  return users;
};

const generatePet = () => {
  return {
    name: faker.animal.dog(),
    species: faker.animal.type(),
    age: faker.number.int({ min: 1, max: 15 })
  };
};

const generatePets = (count = 10) => {
  const pets = [];
  for (let i = 0; i < count; i++) {
    pets.push(generatePet());
  }
  return pets;
};

module.exports = {
  generateUser,
  generateUsers,
  generatePet,
  generatePets
};