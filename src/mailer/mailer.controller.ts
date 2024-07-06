import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { SendEmailDto } from './mail.interface';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('/send-email')
  async sendMail() {
    const dto: SendEmailDto = {
      from: {name: 'Lucky',address: 'lucy@example.com'},
      recipients: [{name: 'John Doe', address:'john@gmail.com'}],
      subject: 'Lucky Winner',
      html: '<p>Jogn your lucker number 22 won </p>'
    }
    return await this.mailerService.sendEmail(dto)
  }  
}
