import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AboutService } from './about.service';

@Controller('about')
export class AboutController {
    constructor(private readonly aboutService: AboutService) { }

    @Post('admin/save')
    async saveContent(@Body('content') content: string, @Res() res: Response) {
        try {
            await this.aboutService.saveContent(content);
            return res.status(HttpStatus.OK).json({ success: true, message: 'Content saved successfully' });
        } catch (error) {
            console.error('Error saving content:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Failed to save content' });
        }
    }

    @Get('client')
    async fetchContent(@Res() res: Response) {
        try {
            const content = await this.aboutService.getContent();
            return res.type('text/html').send(content); // Ensure correct content type
        } catch (error) {
            console.error('Error fetching content:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Failed to fetch content' });
        }
    }
}
