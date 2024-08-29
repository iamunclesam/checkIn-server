// Function to generate a memorable unique ID


function generateUniqueId(username) {
  // Generate a random number or use a specific pattern
  const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  // const uniqueSuffix = crypto
  //   .createHash("md5")
  //   .update(username)
  //   .digest("hex")
  //   .slice(0, 5); 

  return `${username}-${randomNumber}`;
}

module.exports = generateUniqueId;
