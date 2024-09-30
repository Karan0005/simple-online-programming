/* eslint-disable */
const { teardown } = require('./global-setup');

module.exports = async function () {
    try {
        console.log('\nTearing down...\n');
        await teardown();
        console.log('Backend server stopped successfully.');
    } catch (error) {
        console.log('Failed to close backend server', error);
    }
};
