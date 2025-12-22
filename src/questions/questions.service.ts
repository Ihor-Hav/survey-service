import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuestionDto, QuestionType } from './dto/create.question.dto';
import { UpdateQuestionDto } from './dto/update.question.dto';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number, surveyId: number) {
    const survey = await this.prisma.survey.findUnique({
      where: { id: surveyId },
    });

    if (!survey) throw new NotFoundException('Survey not found');
    if (survey.authorId !== userId)
      throw new ForbiddenException('Access denied');

    return this.prisma.question.findMany({
      where: { surveyId },
      include: { options: true },
    });
  }

  async create(userId: number, surveyId: number, dto: CreateQuestionDto) {
    const survey = await this.prisma.survey.findUnique({
      where: { id: surveyId },
    });

    if (!survey) throw new NotFoundException('Survey not found');
    if (survey.authorId !== userId)
      throw new ForbiddenException('Access denied');

    if (dto.type === QuestionType.SINGLE_CHOICE) {
      if (!dto.options || dto.options.length < 2) {
        throw new BadRequestException(
          'Single choice question must have at least 2 options',
        );
      }
      const correctCount = dto.options.filter((o) => o.isCorrect).length;
      if (correctCount !== 1) {
        throw new BadRequestException(
          'Single choice question must have exactly one correct option',
        );
      }
    }

    if (dto.type === QuestionType.MULTIPLE_CHOICE) {
      if (!dto.options || dto.options.length < 2) {
        throw new BadRequestException(
          'Multiple choice question must have at least 2 options',
        );
      }
      const correctCount = dto.options.filter((o) => o.isCorrect).length;
      if (correctCount < 1) {
        throw new BadRequestException(
          'Multiple choice question must have at least one correct option',
        );
      }
    }

    return this.prisma.question.create({
      data: {
        text: dto.text,
        type: dto.type,
        surveyId,
        options: dto.options
          ? {
              create: dto.options.map((o) => ({
                text: o.text,
                isCorrect: o.isCorrect,
              })),
            }
          : undefined,
      },
      include: { options: true },
    });
  }

  async update(userId: number, id: number, dto: UpdateQuestionDto) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: { survey: true, options: true },
    });

    if (!question) throw new NotFoundException('Question not found');
    if (question.survey.authorId !== userId)
      throw new ForbiddenException('Access denied');

    return this.prisma.question.update({
      where: { id },
      data: { text: dto.text, type: dto.type },
      include: { options: true },
    });
  }

  async remove(userId: number, id: number) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: { survey: true },
    });

    if (!question) throw new NotFoundException('Question not found');
    if (question.survey.authorId !== userId)
      throw new ForbiddenException('Access denied');

    await this.prisma.option.deleteMany({ where: { questionId: id } });
    await this.prisma.response.deleteMany({ where: { questionId: id } });

    return this.prisma.question.delete({ where: { id } });
  }
}
