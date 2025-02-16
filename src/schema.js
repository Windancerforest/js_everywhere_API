const { gql } = require('apollo-server-express');

module.exports=gql` scalar DateTime
    type Note{
        id:ID!
        content:String!
        author:String!
        createdAt: DateTime!
        updatedAt: DateTime!
    }
    type Book{
        title:String!
        author:String!
        id:ID!  
    }
    type Query {
    hello: String
    notes: [Note!]!
    note(id: ID!): Note!
    books:[Book!]!
    book(id:ID!):Book!
  }
  type Mutation {
    newNote(content: String!): Note!
    newBook(title:String!,author:String!):Book!
    deleteNote(id:ID!):Boolean!
    updateNote(id:ID!,content:String!):Note!
  }`;

  