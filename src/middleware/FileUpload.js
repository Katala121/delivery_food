import multer from 'multer';
import moment from 'moment';
// import sharp from 'sharp';

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'src/files/');
    },
    filename(req, file, cb) {
        const id = req.user ? req.user.id : req.params.dish_id;
        const fileName = `${moment().format('DD_MM_YYYY_HH-mm')}_id${id}.${file.mimetype.split('/')[1]}`;
        cb(null, fileName);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/gif') {
        cb(null, true);
    } else {
        cb(new Error('Invalid format file'));
    }
};

const limits = {
    fileSize: 5000000,
};

export default multer({ storage, fileFilter, limits });
