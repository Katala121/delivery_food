import multer from 'multer';
// import sharp from 'sharp';

class AvatarUpload {
    constructor() {
        this.storage = this.storage.bind(this);
        this.upload = this.upload.bind(this);
    }

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
        multer({ storage: this.storage() }).single('avatar');
        // console.log('loaded');
    }
}

export default AvatarUpload;
