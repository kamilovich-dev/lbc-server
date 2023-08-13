import { UserDto } from 'dtos/user-dto'
import { UploadedFile  } from 'express-fileupload'

declare global {

    namespace Express {
        interface Request {
            user?: UserDto
            files?: UploadedFile[] | undefined
        }
    }

}
