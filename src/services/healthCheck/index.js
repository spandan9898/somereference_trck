module.exports.healthCheckAPI =  (req, reply) => {
    console.log("Health check API Called.....")
    return reply.code(200).send({err:null});
};
