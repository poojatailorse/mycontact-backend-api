const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");

//@desc Get all contacts
//@route GET /api/contacts
//@access private
const getAllContacts = asyncHandler(async(req,res)=>{
    const contacts = await Contact.find({user_id: req.user.id});
    res.status(200).json(contacts);
});
//@desc Get contact by id
//@route get /api/contacts/:id
//@access private
const getContactById = asyncHandler(async(req,res)=>{
    const contacts = await Contact.findById(req.params.id);
    if(!contacts){
        res.status(404)
        throw new Error("Contact not found");
    }
    res.status(200).json(contacts);
});
//@desc Create contact
//@route POST /api/contacts
//@access private
const createContact = asyncHandler(async(req,res)=>{
    console.log("The Request Body is : ", req.body);
    const {name, email, phone} = req.body;
    if(!name || !email || !phone){
        res.status(400);
        throw new Error("All fields are madatory");
    }
    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id: req.user.id
    })
    res.status(201).json(contact);
});
//@desc Update contact
//@route PUT /api/contacts/:id
//@access private
const UpdateContact = asyncHandler(async(req,res)=>{
    const contacts = await Contact.findById(req.params.id);
    if(!contacts){
        res.status(404)
        throw new Error("Contact not found");
    }
    if(contacts.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("User don't have permission to update other user");
    }
    const UpdatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.status(200).json(UpdatedContact);
});
//@desc Delete contact
//@route DELETE /api/contacts/:id
//@access private
const deleteContact = asyncHandler(async(req,res)=>{
    const contacts = await Contact.findById(req.params.id);
    if(!contacts){
        res.status(404)
        throw new Error("Contact not found");
    }
    if(contacts.user_id.toString() !== req.user.id){
        res.status(403);
        throw new Error("User don't have permission to update other user");
    }
    await Contact.deleteOne({_id: req.params.id});
    res.status(200).json(contacts);
});
module.exports = {getAllContacts, createContact, UpdateContact, deleteContact, getContactById}