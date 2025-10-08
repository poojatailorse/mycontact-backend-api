const express = require("express");
const {getAllContacts, getContactById, createContact, UpdateContact, deleteContact} = require("../controllers/contactController");
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();
router.use(validateToken); 
router.route('/').get(getAllContacts).post(createContact);
router.route('/:id').get(getContactById).put(UpdateContact).delete(deleteContact);
module.exports = router;