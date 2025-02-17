const { gql } = require('apollo-server-express');

module.exports=gql` scalar DateTime
  type Note{
        id:ID!
        content:String!
        author:String!
        createdAt: DateTime!
        updatedAt: DateTime!
        favoriteCount: Int!
        favoritedBy: [User!]
    }
  type Book{
        title:String!
        author:String!
        id:ID!  
    }
  type User{
      id:ID!
      username:String!
      email:String!
      avator:String
      notes:[Note!]!
      favorites: [Note!]!
    }

  type Query {
    hello: String
    notes: [Note!]!
    note(id: ID!): Note!
    books:[Book!]!
    book(id:ID!):Book!
    user(username: String!): User
    users: [User!]!
    me: User!
  }
  type Mutation {
    newNote(content: String!): Note!
    newBook(title:String!,author:String!):Book!
    deleteNote(id:ID!):Boolean!
    updateNote(id:ID!,content:String!):Note!
    signUp(username:String!,email:String!,password:String!):String!
    signIn(username:String,email:String,password:String!):String!
    toggleFavorite(id: ID!): Note!
  }`;

  