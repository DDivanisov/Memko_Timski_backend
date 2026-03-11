const { randomUUID } = require('crypto');

function generateInviteCode() {
  return randomUUID().replace(/-/g, '').slice(0, 8);
}

function generateTaskCode() {
  return `Task - ${randomUUID().replace(/-/g, '').slice(0, 3)}`;
}

module.exports = { generateInviteCode, generateTaskCode };