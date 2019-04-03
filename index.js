const { ApolloServer, gql } = require("apollo-server");

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello(name: String!): String
    users: [User]
    faculty: [User]
    students: [User]
  }

  enum Role {
    Admin
    Student
    Faculty
  }

  interface User {
    id: ID!
    name: String!
    email: String!
    role: Role!
  }

  type Student implements User {
    id: ID!
    name: String!
    email: String!
    role: Role!
    #    courses: [Course]
    gpa: Float!
  }

  type Faculty implements User {
    id: ID!
    name: String!
    email: String!
    role: Role!
    #    courses: [Course]
  }

  type Admin implements User {
    id: ID!
    name: String!
    email: String!
    role: Role!
  }

  type Mutation {
    createUser(name: String!, email: String!, role: Role!): User
  }
`;
class Users {
  constructor() {
    this.nextID = 3;
    this.users = [
      { id: 0, name: "zero", email: "zero@example.com", role: "Admin" },
      { id: 1, name: "one", email: "one@example.com", role: "Student" },
      { id: 2, name: "prof", email: "admin@example.com", role: "Faculty" }
    ];
  }

  create(name, email, role) {
    const new_user = { id: this.nextID, name: name, email: email, role: role };
    this.users.push(new_user);
    this.nextID++;
    return new_user;
  }

  getUsers() {
    return this.users;
  }

  filterUsers(role) {
    const result = [];
    for (const user in this.users) {
      if (user.role === role) {
        result.push(user);
      }
    }
    return result;
  }
}
const users = new Users();
// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: (root, args, context) => `Hello ${args.name}!`,
    users: (root, args, context) => users.getUsers(),

    faculty: (root, args, context) => users.filterUsers("Faculty"),
    students: (root, args, context) => users.filterUsers(args.role)
  },
  Mutation: {
    createUser: (root, args, context) =>
      users.create(args.name, args.email, args.role)
  },
  User: {
    __resolveType: (user, context, info) => user.role
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
