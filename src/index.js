require('dotenv').config();
// Import our environmental variables from our variables.env file

const db = require('./db');
const DB_HOST = process.env.DB_HOST;
const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
// Construct a schema, using GraphQL's schema language
const typeDefs = require('./schema');
// Run our server on a port specified in our .env file or port 4000
const port = process.env.PORT || 4000;

const models = require('./models');


// Provide resolver functions for our schema fields
const resolvers = {
  Query: {
    notes: async () => {
      return await models.Note.find();
    },
    note:async(parent, args) => {
      return await models.Note.findById(args.id);
    },
    books:async()=>{
      return await models.Book.find();
    },
    book:async(parent,args)=>{
      return await models.Book.findById(args.id);
    }
  },
  Mutation: {
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
  }
};

const app = express();
// Connect to the database
db.connect(DB_HOST);

// Apollo Server setup
const server = new ApolloServer({ typeDefs, resolvers });

// Apply the Apollo GraphQL middleware and set the path to /api
server.applyMiddleware({ app, path: '/api' });

app.listen({ port }, () =>
  console.log(
    `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
  )
);