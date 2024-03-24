import { createTransport, Transporter } from 'nodemailer'
import ApiError from '../exceptions/api-error'

class MailService {

    transporter: Transporter

    constructor() {

        this.transporter = createTransport({
            //@ts-ignore
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        })
    }

    async sendActivationMail(to: string, link: string) {
        try {
            await this.transporter.sendMail({
                from: process.env.SMTP_USER,
                to,
                subject: 'Активация аккаунта на ' + process.env.SERVER_URL,
                text: '',
                html:
                `
                  <div>
                        <h1>Для активации перейдите по ссылке</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `
            })
        } catch(e: unknown) {
            if (e instanceof Error) {
                throw ApiError.MailError(`Ошибка при отправке ссылки для активации аккаунта: ${e.message}`, e);
            }
        }

    }

    async sendForgotPasswordMail(to: string, link: string) {
        try {
            await this.transporter.sendMail({
                from: process.env.SMTP_USER,
                to,
                subject: 'Сброс пароля для ' + process.env.CLIENT_URL,
                text: '',
                html:
                `
                  <div>
                        <h1>Для сброса пароля перейдите по ссылке</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `
            })
        } catch(e: unknown) {
            if (e instanceof Error) {
                throw ApiError.MailError(`Ошибка при отправке ссылки для сброса пароля: ${e.message}`, e);
            }
        }
    }
}

export default MailService;
