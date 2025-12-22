import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateResponseDto } from './dto/create.response.dto';
import { QuestionType } from '../questions/dto/create.question.dto';

@Injectable()
export class ResponsesService {
  constructor(private prisma: PrismaService) {}

  async findAll(questionId: number) {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    return this.prisma.response.findMany({
      where: { questionId },
    });
  }

  async create(questionId: number, dto: CreateResponseDto) {
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
      include: {
        options: true,
        survey: true,
      },
    });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    if (question.survey.type === 'EMAIL' && !dto.respondentEmail) {
      throw new BadRequestException('Email is required for this survey');
    }

    if (question.type === QuestionType.TEXT) {
      if (!dto.textAnswer) {
        throw new BadRequestException('Text answer is required');
      }
    }

    if (question.type === QuestionType.RATING) {
      if (dto.rating === undefined) {
        throw new BadRequestException('Rating is required');
      }
    }

    if (
      question.type === QuestionType.SINGLE_CHOICE ||
      question.type === QuestionType.MULTIPLE_CHOICE
    ) {
      if (!dto.selectedOptionIds || dto.selectedOptionIds.length === 0) {
        throw new BadRequestException('Options must be selected');
      }

      // перевірка що всі optionIds належать цьому питанню
      const validOptionIds = question.options.map((o) => o.id);

      const invalidOption = dto.selectedOptionIds.find(
        (id) => !validOptionIds.includes(id),
      );

      if (invalidOption) {
        throw new BadRequestException('Invalid option selected');
      }

      // SINGLE_CHOICE → тільки 1
      if (
        question.type === QuestionType.SINGLE_CHOICE &&
        dto.selectedOptionIds.length !== 1
      ) {
        throw new BadRequestException(
          'Single choice question allows only one option',
        );
      }
    }

    return this.prisma.response.create({
      data: {
        questionId,

        textAnswer:
          question.type === QuestionType.TEXT ? dto.textAnswer : undefined,

        rating: question.type === QuestionType.RATING ? dto.rating : undefined,

        selectedOptionIds:
          question.type === QuestionType.SINGLE_CHOICE ||
          question.type === QuestionType.MULTIPLE_CHOICE
            ? dto.selectedOptionIds
            : [],

        respondentEmail: dto.respondentEmail,
      },
    });
  }

  async update() {
    throw new BadRequestException('Updating responses is not allowed');
  }

  async delete(id: number) {
    const response = await this.prisma.response.findUnique({
      where: { id },
    });

    if (!response) {
      throw new NotFoundException('Response not found');
    }

    return this.prisma.response.delete({
      where: { id },
    });
  }
}
