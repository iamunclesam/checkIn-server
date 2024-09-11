// Function to generate a memorable unique ID


function generateUniqueId(username) {
  // Generate a random number or use a specific pattern
  const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4-digit random number

  return `${username}-${randomNumber}`;
}

module.exports = generateUniqueId;
