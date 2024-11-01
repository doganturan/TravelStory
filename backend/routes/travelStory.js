const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../utulities.js');
const { addTravelStory, getAllStories, uploadImage, deleteImage, editTravelStory, deleteTravelStory, updateIsFavorite, searchTravelStories, filterTravelStories } = require('../controllers/travelStory.js');
const upload = require('../multer.js');

// Travel Story Routes
router.post('/add-travel-story', authenticateToken, addTravelStory);

router.get('/get-all-stories', authenticateToken, getAllStories);

router.put('/edit-travel-story/:id', authenticateToken, editTravelStory);

router.delete('/delete-travel-story/:id', authenticateToken, deleteTravelStory);

router.put('/update-is-favorite/:id', authenticateToken, updateIsFavorite);

router.get('/search', authenticateToken, searchTravelStories);

router.get('/travel-stories/filter', authenticateToken, filterTravelStories);


// Image Routes
router.post('/image-upload', authenticateToken, upload.single("image"), uploadImage);

router.delete('/delete-image', authenticateToken, deleteImage)

module.exports = router;