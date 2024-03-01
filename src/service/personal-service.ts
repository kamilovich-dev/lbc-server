import PersonalDto from "dtos/personal-dto"
import { personal_data as PersonalModel } from 'models/personal_data'
import { user as UserModel } from 'models/user'
import { UploadedFile } from 'express-fileupload'
import fileService from 'service/file-service'

import ApiError from 'exceptions/api-error'


class PersonalService {

    async getPersonalData(userId: number) {
        const personalData = await PersonalModel.findOne({ where: { user_id: userId } });
        if (!personalData) {
            throw ApiError.BadRequest(`Персональные данные пользователя с userId ${userId} не найдены`);
        }
        const personalDto = new PersonalDto(personalData)
        return {personalData: personalDto }
    }

    async create(user_id: number) {
        const candidate = await PersonalModel.findOne({ where: { user_id }, raw: true });
        if (candidate) {
            throw ApiError.BadRequest(`Персональные данные пользователя с user_id ${user_id} уже существуют`);
        }
        const personalData = await PersonalModel.create({ user_id });
        return { personalData }
    }

    async update(user_id: number, email: string, avatar_file: UploadedFile,
        data: Omit<PersonalDto, 'user_id' >) {

        const personalData = await PersonalModel.findOne({ where: { user_id } });
        if (!personalData) throw ApiError.BadRequest(`Не найдены персональные данные пользователя с user_id ${user_id}`);

        const { first_name, last_name, father_name, birth_date, avatar_url } = data

        personalData.first_name = first_name ?? personalData.first_name
        personalData.last_name = last_name ?? personalData.last_name
        personalData.father_name = father_name ?? personalData.father_name
        //@ts-ignore
        personalData.birth_date = birth_date === 'null' ? null :
            birth_date ?? personalData.birth_date

        if (avatar_url === 'null') {
            if (personalData.dataValues.avatar_url) await fileService.removeFile(personalData.dataValues.avatar_url)
            //@ts-ignore
            personalData.avatar_url = null
        } else if (avatar_file && email) {
            if (personalData.dataValues.avatar_url) await fileService.removeFile(personalData.dataValues.avatar_url)
            const avatarUrl = await fileService.saveFile(avatar_file, email, 'avatar-')
            personalData.avatar_url = avatarUrl
        }

        await personalData.save()
        return { personalData }
    }
}

export default new PersonalService()