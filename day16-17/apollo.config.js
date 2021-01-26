module.exports = {
  client: {
    includes: ["./src/**/*.tsx"],
    tagName: "gql",
    service: {
      name: "my-podcast-backend",
      url: "https://my-podcast-backend.herokuapp.com/graphql",
    },
  },
};
