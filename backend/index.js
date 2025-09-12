require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors  = require('cors');
const fileUpload = require('express-fileupload');
const GovScheme = require('./models/GovSchemes');
const path=require('path');
const fs=require('fs');
const Contract = require('./models/Contract');
const Farmer = require('./models/Farmer');


// console.log('Using MongoDB URI:', process.env.MONGODB_URI);

const app = express();
// app.use(cors());
app.use(cors({ origin: '*' }));
app.use(fileUpload());

app.use(express.json({ type: '*/*' }));

app.use(express.urlencoded({ extended: true }));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

let latestMoisture = 0; 


app.get('/', (req, res) => {
  res.send('API is running 🎯');
});


// GET route to fetch farmer by UID
app.get('/api/farmers/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const farmer = await Farmer.findOne({ uid });
    if (!farmer) return res.status(404).json({ error: 'Farmer not found' });
    res.json(farmer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});





app.post('/api/farmers', async (req, res) => {
  try {
    const {
      uid,
      name,
      location,
      language,
      landSize,
      cropType,
      irrigation
    } = req.body;

    let profilePicPath = '';

    // Handle image upload
    if (req.files && req.files.profilePic) {
      const file = req.files.profilePic;
      const uploadDir = path.join(__dirname, 'uploads');

      // Ensure uploads folder exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }

      const fileName = `${uid}_${Date.now()}_${file.name}`;
      const filePath = path.join(uploadDir, fileName);
      await file.mv(filePath);

      profilePicPath = `/uploads/${fileName}`;
    }

    const updatedData = {
      uid,
      name,
      location,
      language,
      landSize,
      cropType,
      irrigation,
    };

    if (profilePicPath) {
      updatedData.profilePic = profilePicPath;
    }

    const farmer = await Farmer.findOneAndUpdate(
      { uid },
      updatedData,
      { upsert: true, new: true }
    );

    res.status(200).json(farmer);
  } catch (error) {
    console.error('Save failed:', error);
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

app.delete('/api/farmers/remove-image', async (req, res) => {
  console.log('Incoming DELETE request body:', req.body);

  const { uid } = req.body;
  if (!uid) return res.status(400).json({ error: 'UID is required' });

  try {
    const farmer = await Farmer.findOne({ uid });
    if (!farmer) {
      console.log('Farmer not found');
      return res.status(404).json({ error: 'Farmer not found' });
    }

    if (!farmer.profilePic) {
      console.log('No profilePic field in farmer');
      return res.status(404).json({ error: 'Image not found' });
    }

    const filename = farmer.profilePic.split('/uploads/')[1];
    if (!filename) {
      console.log('ProfilePic path malformed:', farmer.profilePic);
      return res.status(400).json({ error: 'Invalid image path' });
    }

    const imagePath = path.join(__dirname, 'uploads', filename);
    console.log('Resolved image path:', imagePath);

    if (fs.existsSync(imagePath)) {
      try {
        fs.unlinkSync(imagePath);
        console.log('Image deleted from disk');
      } catch (unlinkErr) {
        console.error('Failed to unlink image:', unlinkErr);
        return res.status(500).json({ error: 'Failed to delete image file' });
      }
    } else {
      console.log('Image file does not exist:', imagePath);
    }

    farmer.profilePic = '';
    await farmer.save();

    res.json({ message: 'Image deleted successfully' });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Server error deleting image' });
  }
});


app.post('/uploadScheme', async (req, res) => {
  try {
    const { title, description } = req.body;
    const file = req.files.document;

    const filename = Date.now() + '-' + file.name;
    const filepath = path.join(__dirname, 'uploads', filename);

    await file.mv(filepath);

    const scheme = new GovScheme({
      title,
      description,
      document: `uploads/${filename}`
    });

    await scheme.save();

    res.json({ message: 'Scheme uploaded successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all schemes
app.get('/schemes', async (req, res) => {
  const schemes = await GovScheme.find();
  res.json(schemes);
});

// Get one scheme
app.get('/schemes/:id', async (req, res) => {
  try {
    const scheme = await GovScheme.findById(req.params.id);
    if (!scheme) return res.status(404).json({ error: 'Scheme not found' });
    res.json(scheme);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Create a contract
app.post('/api/contracts', async (req, res) => {
  try {
    const contract = new Contract(req.body);
    await contract.save();
    res.status(201).json(contract);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all contracts by farmer UID
app.get('/api/contracts/:uid', async (req, res) => {
  try {
    const contracts = await Contract.find({ farmerUid: req.params.uid });
    res.json(contracts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get one contract by ID
app.get('/api/contract/:id', async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);
    if (!contract) return res.status(404).json({ error: 'Contract not found' });
    res.json(contract);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});





const PORT = process.env.PORT || 5000;
app.listen(PORT,'0.0.0.0', () => console.log(`Server running on port ${PORT}`));
