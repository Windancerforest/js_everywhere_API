const models= require("../models");




module.exports = {
    notes: async () => {
     return await models.Note.find()
    },
    note: async (parent, args) => {
     return await models.Note.findById(args.id);
    },
    books:async()=>{
        return await models.Book.find();
    },
    book:async(parent,args)=>{
        return await models.Book.findById(args.id);
    }
  } 