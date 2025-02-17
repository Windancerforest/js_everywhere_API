const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');
const {
  AuthenticationError,
  ForbiddenError
}=require('apollo-server-express');
require('dotenv').config();

const gravator = require('../util/gravatar');



module.exports = {
  // 新建笔记
  newNote: async (parent, args, { models,user}) => {
    //如果没有用户上下文，抛出一个认证错误
    if(!user){
      throw new AuthenticationError('You must be signed in to create a note');
    }
    return await models.Note.create({
      content: args.content,
      author: mongoose.Types.ObjectId(user.id),
    });
  },
  deleteNote: async (parent, { id }, { models, user }) => {
    // if not a user, throw an Authentication Error
    if (!user) {
      throw new AuthenticationError('You must be signed in to delete a note');
    }
  
    // find the note
    const note = await models.Note.findById(id);
    // if the note owner and current user don't match, throw a forbidden error
    if (note && String(note.author) !== user.id) {
      throw new ForbiddenError("You don't have permissions to delete the note");
    }
  
    try {
      // if everything checks out, remove the note
      await note.remove();
      return true;
    } catch (err) {
      // if there's an error along the way, return false
      return false;
    }
  }, 
  newBook: async (parent, args, { models }) => {
    return await models.Book.create({
      title: args.title,
      author: args.author,
    });
  },
  //更新笔记
  updateNote: async (parent, { content, id }, { models, user }) => { // if not a user, throw an Authentication Error
    if (!user) { throw new AuthenticationError('You must be signed in to update a note');
    } // find the note
    const note = await models.Note.findById(id); // if the note owner and current user don't match, throw a forbidden error
    if (note && String(note.author) !== user.id) { throw new ForbiddenError("You don't have permissions to update the note");
    } // Update the note in the db and return the updated note
    return await models.Note.findOneAndUpdate(
      {
        _id: id
      },
      {
        $set: {
          content
        }
      },
      { new: true }
    );
  },

  //注册
  signUp:async(parent,{username,email,password},{models})=>{
    //格式化邮箱
    email=email.trim().toLowerCase();
    //哈希密码
    const hashed=await bcrypt.hash(password,10);
    //创建gravatar头像 使用
    const avatar=gravator(email); 
    try{
      const user=await models.User.create({
        username,
        email,
        avatar,
        password:hashed
      });
      //创建并返回json web token
      return jwt.sign({id:user._id},process.env.JWT_SECRET);
    }
    catch(err){
      console.log(err);
      //如果有问题，抛出一个错误
      throw new Error('Error creating account');
    }
  },

  //登录
  signIn:async(parent,{username,email,password},{models})=>{
    if(email){
      //格式化邮箱
      email=email.trim().toLowerCase();
    } 
    const user=await models.User.findOne({
      $or:[{email},{username}]
    });
    //如果没有用户，抛出一个认证错误
    if(!user){
      throw new AuthenticationError('Error signing in');
    }

    //如果密码不匹配，抛出一个认证错误
    const valid=await bcrypt.compare(password,user.password);
    if(!valid){
      throw new AuthenticationError('Error signing in');
    }

    //创建并返回json web token
    return jwt.sign({id:user._id},process.env.JWT_SECRET);
  },
  //切换笔记收藏状态
  toggleFavorite: async (parent, { id }, { models, user }) => {
    // if no user context is passed, throw auth error
    if (!user) {
      throw new AuthenticationError();
    }
  
    // check to see if the user has already favorited the note
    let noteCheck = await models.Note.findById(id);
    const hasUser = noteCheck.favoritedBy.indexOf(user.id);
  
    // if the user exists in the list
    // pull them from the list and reduce the favoriteCount by 1
    if (hasUser >= 0) {
      return await models.Note.findByIdAndUpdate(
        id,
        {
          $pull: {
            favoritedBy: mongoose.Types.ObjectId(user.id)
          },
          $inc: {
            favoriteCount: -1
          }
        },
        {
          // Set new to true to return the updated doc
          new: true
        }
      );
    } else {
      // if the user doesn't exist in the list
      // add them to the list and increment the favoriteCount by 1
      return await models.Note.findByIdAndUpdate(
        id,
        {
          $push: {
            favoritedBy: mongoose.Types.ObjectId(user.id)
          },
          $inc: {
            favoriteCount: 1
          }
        },
        {
          new: true
        }
      );
    }
  }, 
  
} 