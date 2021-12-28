const { Client } = require("@elastic/elasticsearch");

let elkClient;

if (["staging", "production"].includes(process.env.NODE_ENV)) {
  const elasticoid = process.env.ELASTICO_ID;
  const username = process.env.ELASTICO_USERNAME;
  const password = process.env.ELASTICO_PASSWORD;

  elkClient = new Client({
    cloud: {
      id: elasticoid,
    },
    auth: {
      username,
      password,
    },
  });
}

module.exports = elkClient;
