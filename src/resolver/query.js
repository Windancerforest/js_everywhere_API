
module.exports = {
    notes: async (parent, args, { models }) => {
     return await models.Note.find()
    },
    note: async (parent, args, { models }) => {
     return await models.Note.findById(args.id);
    },
    books:async (parent, args, { models }) => {
      return await models.Book.find();
    },
    book:async (parent, args, { models }) => {
      return await models.Book.findById(args.id);
    },
  } 