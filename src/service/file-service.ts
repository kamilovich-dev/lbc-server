import * as uuid from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import { UploadedFile  } from 'express-fileupload'

class FileService {

    private staticPath = process.env.STATIC_PATH || 'static'

    async saveFile(file: UploadedFile, email: string, prefix?: string) {
        try {
            const fileExtension = '.' + file.mimetype.replace(/.*\//, '')
            const fileName = `${prefix ?? ''}${uuid.v4()}${fileExtension}`;

            const directory = path.resolve(this.staticPath, email)

            if ( !fs.existsSync( directory) ) {
                fs.mkdirSync(directory);
            }

            const filePath = path.resolve(directory, fileName);
            await file.mv(filePath);

            return path.join(email, fileName)
        } catch(e) {
            throw e;
        }
    }

    async removeFile(filePath: string) {
        try {
            const resolvedFilePath = path.resolve(this.staticPath, filePath)
            if (fs.existsSync(resolvedFilePath)) {
                fs.unlinkSync(resolvedFilePath)
            }
        } catch(e) {
            throw e
        }
    }
}

export default new FileService();