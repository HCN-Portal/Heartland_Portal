// const crypto = require('crypto');

// const generateEmployeeId = () => {
//   const prefix = 'HCN25';
//   const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

//   const hasLetterAndNumber = (str) => {
//     const hasLetter = /[A-Z]/.test(str);
//     const hasNumber = /[0-9]/.test(str);
//     return hasLetter && hasNumber;
//   };

//   let randomPart = '';

//   do {
//     randomPart = '';
//     while (randomPart.length < 4) {
//       const byte = crypto.randomBytes(1)[0];
//       randomPart += charset.charAt(byte % charset.length);
//     }
//   } while (!hasLetterAndNumber(randomPart));

//   return `${prefix}${randomPart}`;
// };

// module.exports = generateEmployeeId;

// utils/employeeId.js
const crypto = require('crypto');
const User = require('../models/user'); // Import User model

const generateEmployeeId = async () => {
  const prefix = 'HCN25';
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  const hasLetterAndNumber = (str) => {
    const hasLetter = /[A-Z]/.test(str);
    const hasNumber = /[0-9]/.test(str);
    return hasLetter && hasNumber;
  };

  let employeeId;
  let isUnique = false;

  while (!isUnique) {
    let randomPart = '';
    while (randomPart.length < 4) {
      const byte = crypto.randomBytes(1)[0];
      randomPart += charset.charAt(byte % charset.length);
    }

    if (hasLetterAndNumber(randomPart)) {
      employeeId = `${prefix}${randomPart}`;

      // Check if this employeeId already exists in DB
      const existingUser = await User.findOne({ employeeId });
      if (!existingUser) {
        isUnique = true;
      }
    }
  }

  return employeeId;
};

module.exports = generateEmployeeId;
