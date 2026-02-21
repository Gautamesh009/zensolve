const prisma = require('../config/prisma');
const cloudinary = require('../config/cloudinary');
const { classifyComplaint } = require('../services/geminiService');

const submitComplaint = async (req, res) => {
    try {
        const { title, description, category: userCategory, latitude, longitude, address } = req.body;
        const imageFile = req.file;

        let imageUrl = null;
        if (imageFile) {
            // Upload to Cloudinary
            const b64 = Buffer.from(imageFile.buffer).toString("base64");
            let dataURI = "data:" + imageFile.mimetype + ";base64," + b64;
            const uploadRes = await cloudinary.uploader.upload(dataURI, {
                resource_type: "auto",
                folder: "grievances"
            });
            imageUrl = uploadRes.secure_url;
        }

        // AI Classification
        const aiResult = await classifyComplaint(description, imageUrl);

        // Create record
        const complaint = await prisma.complaint.create({
            data: {
                title,
                description,
                category: aiResult.category || userCategory || "OTHER",
                priority: aiResult.priority || 5,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                address,
                imageUrl,
                department: aiResult.department || "SANITATION",
                userId: "demo-user-id", // Temporary until real auth
            }
        });

        // Real-time update via Socket.io
        const io = req.app.get('io');
        io.emit('new-complaint', complaint);

        res.status(201).json(complaint);
    } catch (error) {
        console.error("Submission Error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

const getMyComplaints = async (req, res) => {
    try {
        const complaints = await prisma.complaint.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch complaints" });
    }
};

module.exports = { submitComplaint, getMyComplaints };
