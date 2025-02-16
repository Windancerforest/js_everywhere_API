
module.exports = {
  newNote: async (parent, args, { models }) => {
    return await models.Note.create({
      content: args.content,
      author: 'Adam Scott'
    });
  },
  deleteNote:async(parent,{id},{models}) =>{
    try{
      await models.Note.findOneAndRemove({_id:id});
      return true;
    }catch(err){
      return false;
    }
  },
  newBook: async (parent, args, { models }) => {
    return await models.Book.create({
      title: args.title,
      author: args.author,
    });
  },
  updateNote:async(parent,{id,content},{models})=>{
    return await models.Note.findOneAndUpdate(
      {
        _id:id,
      },
      {
        $set:{
          content
        }
      },
      {
        new:true
      }
    );
  },
  
} 