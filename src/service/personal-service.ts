import PersonalDto from "dtos/personal-dto"
import { personal_data as PersonalModel } from 'models/personal_data'
import { user as UserModel } from 'models/user'
import { UploadedFile } from 'express-fileupload'
import fileService from 'service/file-service'

import ApiError from 'exceptions/api-error'


class PersonalService {

    async getPersonalData(userId: number) {
        const personalData = await PersonalModel.findOne({ where: { user_id: userId } });
        if (!personalData) throw ApiError.BadRequest(`Персональные данные пользователя с userId ${userId} не найдены`);

        const personalDto = new PersonalDto(personalData)
        return {personalData: personalDto }
    }

    async create(userId: number) {
        const candidate = await PersonalModel.findOne({ where: { user_id: userId }, raw: true });
        if (candidate) throw ApiError.BadRequest(`Персональные данные пользователя с userId ${userId} уже существуют`);

        const personalData = await PersonalModel.create({ user_id: userId });
        return { personalData }
    }

    async update(userId: number, data: PersonalDto) {

        const personalData = await PersonalModel.findOne({ where: { user_id: userId } });
        if (!personalData) throw ApiError.BadRequest(`Не найдены персональные данные пользователя с userId ${userId}`);

        const { firstName, lastName, fatherName, birthDate } = data

        personalData.first_name = firstName ?? personalData.first_name
        personalData.last_name = lastName ?? personalData.last_name
        personalData.father_name = fatherName ?? personalData.father_name
        //@ts-ignore
        personalData.birth_date = birthDate === '' ? null :
            birthDate ?? personalData.birth_date

        await personalData.save()
        const personalDto = new PersonalDto(personalData)
        return { personalData: personalDto }
    }
}

export default new PersonalService()