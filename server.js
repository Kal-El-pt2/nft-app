const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const ipfsClient = require('ipfs-http-client');
const app = express();
const PORT = process.env.PORT || 3001;

mongoose.connect('your-mongodb-connection-string', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const WalletSchema = new mongoose.Schema({
  nftMint: String,
});

const Wallet = mongoose.model('Wallet', WalletSchema);

app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), async (req, res) => {
  const { walletId } = req.body;

  // Save the walletId in MongoDB
  await Wallet.create({ nftMint: walletId });

  // Use IPFS or any other storage service to store the image
  const ipfs = ipfsClient('your-ipfs-endpoint');
  const { path } = await ipfs.add(req.file.buffer);

  res.json({ ipfsPath: path });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
