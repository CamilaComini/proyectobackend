const express = require('express');
const router = express.Router();
const { generateUsers, generatePets } = require('../utils/mockgenerator.js');
const User = require('../models/user.js'); 
const Pet = require('../models/pet.js');   


router.get('/mockingusers', async (req, res) => {
  try {
    const users = await generateUsers(50);
    res.json({ status: "success", payload: users });
  } catch (err) {
    res.status(500).json({ status: "error", error: "Error al generar usuarios" });
  }
});

router.post('/generateData', async (req, res) => {
  try {
    const userCount = parseInt(req.query.users) || 0;
    const petCount = parseInt(req.query.pets) || 0;

    const users = await generateUsers(userCount);
    const pets = generatePets(petCount);

    await User.insertMany(users);
    await Pet.insertMany(pets);

    res.json({ status: "success", message: `${userCount} usuarios y ${petCount} mascotas insertados` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", error: "Error al insertar datos" });
  }
});

router.get('/mockingpets', (req, res) => {
  const pets = generatePets(10);
  res.json({ status: "success", payload: pets });
});

module.exports = router;