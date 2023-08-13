import * as uuid from 'uuid';
import * as path from 'path';
import * as fs from 'fs';
import { UploadedFile  } from 'express-fileupload'

class FileService {

    private staticPath = 'static'

    async saveFile(file: UploadedFile, email: string) {
        try {
            const fileExtension = '.' + file.mimetype.replace(/.*\//, '')
            const fileName = uuid.v4() + fileExtension;
            const directory = path.resolve(this.staticPath, email)

            if ( !fs.existsSync( directory) ) {
                await fs.mkdirSync(directory);
            }

            const filePath = path.resolve(directory, fileName);
            await file.mv(filePath);

            return path.join(this.staticPath, email, fileName)
        } catch(e) {
            throw e;
        }
    }

    async removeFile(filePath: string) {
        try {
            if (fs.existsSync(path.resolve(filePath))) {
                await fs.unlinkSync(filePath)
            }
        } catch(e) {
            throw e
        }
    }
}

export default new FileService();