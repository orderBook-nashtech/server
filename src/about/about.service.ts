import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import * as path from 'path';

@Injectable()
export class AboutService {
    private readonly contentFilePath = path.join(__dirname, '..', 'content', 'aboutContent.html');

    async saveContent(content: string): Promise<void> {
        try {
            console.log(`Saving content to ${this.contentFilePath}`);
            await fs.writeFile(this.contentFilePath, content, 'utf8');
        } catch (error) {
            console.error('Error saving content:', error);
            throw error;
        }
    }

    async getContent(): Promise<string> {
        try {
            console.log(`Reading content from ${this.contentFilePath}`);
            return await fs.readFile(this.contentFilePath, 'utf8');
        } catch (error) {
            console.error('Error reading content:', error);
            if (error.code === 'ENOENT') {
                console.error(`File not found: ${this.contentFilePath}`);
            }
            throw error;
        }
    }
}
