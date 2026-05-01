const express = require('express');
const router = express.Router();
const MedicalReport = require('../models/reports');
const auth = require('../middlewares/auth'); // Your JWT Bouncer
const upload = require('../middlewares/upload'); // Your AWS Uploader

const { GetObjectCommand, S3Client } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

router.get('/view/:id', auth, async (req, res) => {
  try {
    const report = await MedicalReport.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found.' });

    // Extract the S3 key from the stored URL and decode it (to fix spaces being %20)
    const encodedKey = report.fileUrl.split('.amazonaws.com/')[1];
    const key = decodeURIComponent(encodedKey);

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key
    });

    // URL expires in 5 minutes
    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
    return res.status(200).json({ url: signedUrl });
  } catch (error) {
    return res.status(500).json({ message: 'Error generating URL.', error: error.message });
  }
});
// @route   POST /api/reports
// @desc    Upload a medical report to AWS S3 and save to MongoDB
// @access  Private (Requires Token)
router.post('/', auth, upload.single('reportFile'), async (req, res) => {
    try {
        // 1. If multer-s3 failed, there won't be a file object
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file.' });
        }

        // 2. Grab the text data from the request body
        const { doctorId, title, reportType } = req.body;
        
        // 3. Grab the secure patient ID from the JWT token!
        const patientId = req.user.id;

        // 4. Create the report in MongoDB
        const newReport = await MedicalReport.create({
            patientId: patientId,
            doctorId: doctorId,
            title: title,
            reportType: reportType,
            fileUrl: req.file.location // THIS IS THE MAGIC URL FROM AMAZON S3!
        });

        // 5. Success response
        return res.status(201).json({
            message: 'Report uploaded successfully to AWS S3!',
            report: newReport
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error during upload.', error: error.message });
    }
});

router.get('/', auth, async (req, res) => {
  try {
    const reports = await MedicalReport.find({ patientId: req.user.id })
      .populate('doctorId', 'doctorName specialization');
    return res.status(200).json(reports);
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error: error.message });
  }
});

// GET /api/reports/patient/:patientId
//specific patient medical history

router.get('/patient/:patientId', async (req, res) => {
    try {
        const history = await MedicalReport.find({ patientId: req.params.patientId })
                                           .populate('doctorId', 'doctorName');
        res.status(200).json(history);
    } catch (error) {
        res.status(500).json({ message: "Database query failed", error: error.message });
    }
});

module.exports = router;