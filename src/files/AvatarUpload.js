import multer from 'multer';
// import sharp from 'sharp';

class AvatarUpload {
    storage() {
        multer.diskStorage({
            destination(req, file, cb) {
                cb(null, 'files/');
            },
            filename(req, file, cb) {
                cb(null, file.originalname);
            },
        });
    }

    upload() {
        multer({ storage: this.storage }).single('avatar');
    }
}

export default AvatarUpload;
