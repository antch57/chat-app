// define a few functions that generate message objects.
const generateMessage = (text) => {
    return {
        text,
        createdAt: new Date().getTime()
    };
};

module.exports = {
    generateMessage
}