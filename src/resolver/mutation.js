const { models } = require("../models");


module.exports = {
    newNote: async(parent, args) => {
        return await models.Note.create({
          content:args.content,
          author:'Adam Scott'
        })
      },
    newBook:async(parent,args)=>{
       return await models.Book.create({
        title:args.title,
        author:args.author
       })
    }
};