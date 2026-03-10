const uuid = require('uuid');


function generateInviteCode() {
    return uuid.v4().replace(/-/g, '').slice(0, 8);
}

function generateTaskCode() {
    return `Task - ${uuid.v4().replace(/-/g, '').slice(0, 3)}`;
}

module.exports = { generateInviteCode, generateTaskCode };