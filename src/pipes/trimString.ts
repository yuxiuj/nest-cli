import {
  BadRequestException,
  PipeTransform,
  ArgumentMetadata,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class TrimStringPipe implements PipeTransform<string> {
  async transform(value: string, metadata: ArgumentMetadata): Promise<string> {
    try {
      return value
        .toString()
        .replace(/\s+/g, '')
        .toLowerCase();
    } catch (e) {
      throw new BadRequestException('Validation failed (string is expected)');
    }
  }
}
