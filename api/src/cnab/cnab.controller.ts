import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiBody,
  ApiOperation,
  ApiTags,
  ApiResponse,
} from '@nestjs/swagger';
import { CNABService } from './cnab.service';

@ApiTags('CNAB')
@Controller('cnab')
export class CNABController {
  constructor(private readonly cnabService: CNABService) { }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Uploads a CNAB file and processes transactions',
  })
  @ApiConsumes('multipart/form-date')
  @ApiBody({
    description: 'CNAB File .txt',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'File uploaded successfully' })
  @ApiResponse({ status: 400, description: 'File error' })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('File error', HttpStatus.BAD_REQUEST);
    }

    const content = file.buffer.toString('utf-8');
    const result = await this.cnabService.processCNAB(content);

    return {
      message: 'File uploaded successfully',
      totalRegistros: result.length,
    };
  }
}
