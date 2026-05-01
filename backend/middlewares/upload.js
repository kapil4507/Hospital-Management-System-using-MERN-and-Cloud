const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');

// 1. Log into AWS using the keys from your .env file
const s3Config = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

// 2. Configure Multer to intercept the file and stream it to S3
const upload = multer({
    storage: multerS3({
        s3: s3Config,
        bucket: process.env.AWS_BUCKET_NAME,
        // This ensures the file is readable when you click the link later
        //acl: 'public-read', 
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            // Rename the file to ensure no two files have the exact same name
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, 'reports/' + uniqueSuffix + '-' + file.originalname);
        }
    })
});

module.exports = upload;