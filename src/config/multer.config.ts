// // src/config/multer.config.ts
import { diskStorage } from 'multer';
import { extname } from 'path';

// export const multerOptions = {
//     storage: diskStorage({
//         destination: './uploads',  // Ensure this directory exists; you might need to create it
//         filename: (req, file, cb) => {
//             const uniqueName = Date.now() + '-' + Math.random().toString(36).substring(2, 15); // Unique name for the file
//             cb(null, `${uniqueName}${extname(file.originalname)}`);  // Append the original file extension
//             console.log(uniqueName);
            
//         }
//     }),
//     limits: {
//         fileSize: 1024 * 1024 * 5  // 5 MB file size limit
//     },
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
//             // Allow image files only
//             cb(null, true);
//         } else {
//             cb(new Error('Only image files are allowed!'), false);
//         }
//     }
// };

export const storageConfig = (folder:string) => diskStorage({
    destination: `uploads/${folder}`,
    filename: (req,file,cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})