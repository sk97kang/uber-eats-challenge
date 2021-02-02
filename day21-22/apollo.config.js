module.exports = {
  client: {
    include: ["src/**/*.tsx"],
    tagName: "gql",
    service: {
      name: "Ubereats Challenge backend",
      url: "https://my-podcast-backend.herokuapp.com/graphql",
      // optional headers
      headers: {
        authorization: "Bearer lkjfalkfjadkfjeopknavadf",
      },
    },
  },
};
