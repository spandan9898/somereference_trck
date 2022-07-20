module.exports.healthCheckAPI =  (req, reply) => {
    return reply.code(200).send({err:null});
};
