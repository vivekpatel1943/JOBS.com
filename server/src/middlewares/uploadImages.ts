import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../utils/cloudinary';

const storage = new CloudinaryStorage({
    cloudinary,
    params : async (req,file) => {
        return {
            folder : "userImages", //all the images are stored in the "userImages" folder 
            allowed_formats : ["jpg","jpeg","png","webp"]
        }
    }
})

const upload = multer({storage});


export default upload;