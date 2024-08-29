const QRCode = require("qrcode");
const QRCodeModel = require("../models/qrCode"); 

// Function to generate QR code and save data in MongoDB
const generateAndStoreQRCode = async (userId, ticketNumber) => {
  try {
    const qrCodeContent = JSON.stringify({ userId, ticketNumber });

    const qrCodeImageUrl = await QRCode.toDataURL(qrCodeContent);

    const qrCodeData = new QRCodeModel({
      userId,
      ticketNumber,
      qrCodeContent,
      qrCodeUrl: qrCodeImageUrl,
    });

    await qrCodeData.save();

    console.log("QR Code generated and saved successfully:", qrCodeImageUrl);
    return qrCodeImageUrl;
  } catch (error) {
    console.error("Failed to generate or save QR code:", error);
    throw error;
  }
};


generateAndStoreQRCode(userId, ticketNumber)
  .then((qrCode) => {
    console.log("QR Code generated and saved:", qrCode);
  })
  .catch((error) => {
    console.error("Error:", error);
  });
