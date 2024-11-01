const TravelStory = require('../models/travelStory');
const path = require('path');
const fs = require('fs');

// Add travel story
const addTravelStory = async (req, res) => {
    const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
    const { userId } = req.user;

    // Validate required fields
    if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
        return res.status(400).json({ error: true, message: "All fields are required!" });
    }

    // Convert visitedDate from miliseconds to Date object
    const parsedVisitedDate = new Date(parseInt(visitedDate));

    try {
        const travelStory = new TravelStory({
            title,
            story,
            visitedLocation,
            userId,
            imageUrl,
            visitedDate: parsedVisitedDate
        })

        await travelStory.save();
        res.status(201).json({ story: travelStory, message: "Travel story added successfully" });
    } catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }

}

// Get all travel stories
const getAllStories = async (req, res) => {
    const { userId } = req.user;

    try {
        const travelStories = await TravelStory.find({ userId: userId }).sort({ isFavorite: -1 });
        res.status(200).json({ stories: travelStories })
    } catch (error) {
        res.status(500).json({ error: true, message: error.message })
    }
}

const editTravelStory = async (req, res) => {
    const { id } = req.params;
    const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
    const { userId } = req.user;

    // Validate required fields
    if (!title || !story || !visitedLocation || !visitedDate) {
        return res.status(400).json({ error: true, message: "All fields are required!" });
    }

    // Convert visitedDate from miliseconds to Date object
    const parsedVisitedDate = new Date(parseInt(visitedDate));

    try {
        // Find the travel story by ID and ensure it belongs to the authenticated user
        const travelStory = await TravelStory.findOne({ _id: id, userId: userId });
        if (!travelStory) {
            return res.status(404).json({ error: true, message: "Travel story not found!" });
        }
        const placeHolderImageUrl = "http://localhost:8000/assets/placeholder.png";
        travelStory.title = title;
        travelStory.story = story;
        travelStory.visitedLocation = visitedLocation;
        travelStory.imageUrl = imageUrl || placeHolderImageUrl;
        travelStory.visitedDate = parsedVisitedDate;

        await travelStory.save();
        return res.status(200).json({ story: travelStory, message: "Update Successful" });

    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
}

const deleteTravelStory = async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;

    try {
        // Find the travel story by ID and ensure it belongs to the authenticated user
        const travelStory = await TravelStory.findOne({ _id: id, userId: userId });
        if (!travelStory) {
            return res.status(404).json({ error: true, message: "Travel story not found!" });
        }

        // Delete the travel story
        await travelStory.deleteOne({ _id: id, userId: userId });

        // Extract the filename from the imageUrl
        const imageUrl = travelStory.imageUrl;
        const filename = path.basename(imageUrl);
        const filePath = path.join(__dirname, '..', 'uploads', filename);

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error("Failed to delete image file:", err);
            }
        });

        res.status(200).json({ message: "Travel Story deleted successfully" })

    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
}

const updateIsFavorite = async (req, res) => {
    const { id } = req.params;
    const { isFavorite } = req.body;
    const { userId } = req.user;

    try {
        const travelStory = await TravelStory.findOne({ _id: id, userId: userId });
        if (!travelStory) {
            res.status(404).json({ error: true, message: "Travel story not found!" });
        }

        travelStory.isFavorite = isFavorite;
        await travelStory.save();
        res.status(200).json({ story: travelStory, message: "Favorite updated successfully" })
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
}

const searchTravelStories = async (req, res) => {
    const { query } = req.query;
    const { userId } = req.user;

    if (!query) {
        return res.status(404).json({ error: true, message: 'Query is required!' });
    }

    try {
        const searchResults = await TravelStory.find({
            userId: userId,
            $or: [
                { title: { $regex: query, $options: "i" } },
                { story: { $regex: query, $options: "i" } },
                { visitedLocation: { $regex: query, $options: "i" } }
            ]
        }).sort({ isFavorite: -1 })

        res.status(200).json({ stories: searchResults })
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
}

const filterTravelStories = async (req, res) => {
    const { startDate, endDate } = req.query;
    const { userId } = req.user;

    try {
        // Convert startDate and endDate from miliseconds to Date objects
        const start = new Date(parseInt(startDate));
        const end = new Date(parseInt(endDate));

        // Find travel stories that belong to the authenticated user and fall within the date range
        const filteredTravelStories = await TravelStory.find({
            userId: userId,
            visitedDate: { $gte: start, $lte: end }
        }).sort({ isFavorite: -1 })

        res.status(200).json({ stories: filteredTravelStories });

    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
}


// Handle image upload & delete
const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: true, message: "No image uploaded!" })
        }

        const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;

        res.status(200).json({ imageUrl })
    }
    catch (error) {
        res.status(500).json({ error: true, message: error.message })
    }
}

const deleteImage = async (req, res) => {
    const { imageUrl } = req.query;

    if (!imageUrl) {
        return res.status(400).json({ error: true, message: "ImageURL parameter is required!" });
    }

    // Extract the filename from the imageUrl
    try {
        const filename = path.basename(imageUrl);
        const filePath = path.join(__dirname, '..', 'uploads', filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            return res.status(200).json({ message: "Image deleted successfully" });
        } else {
            return res.status(404).json({ error: true, message: "Image not found!" });
        }
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
};



module.exports = { filterTravelStories, searchTravelStories, addTravelStory, getAllStories, uploadImage, deleteImage, editTravelStory, deleteTravelStory, updateIsFavorite }