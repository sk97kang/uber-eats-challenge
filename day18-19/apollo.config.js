module.exports = {
  client: {
    includes: ["./src/**/*.{tsx,ts}"],
    tagname: "gql",
    service: {
      name: "podcast-backend",
      url: "https://my-podcast-backend.herokuapp.com/graphql",
    },
  },
};
