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

    async update(user_id: number, data: PersonalDto) {

        const personalData = await PersonalModel.findOne({ where: { user_id } });
        if (!personalData) throw ApiError.BadRequest(`Не найдены персональные данные пользователя с user_id ${user_id}`);

        const { firstName, lastName, fatherName, birthDate } = data

        personalData.first_name = firstName ?? personalData.first_name
        personalData.last_name = lastName ?? personalData.last_name
        personalData.father_name = fatherName ?? personalData.father_name
        //@ts-ignore
        personalData.birth_date = birthDate === 'null' ? null :
            birthDate ?? personalData.birth_date

        await personalData.save()
        return { personalData }
    }
}

export default new PersonalService()