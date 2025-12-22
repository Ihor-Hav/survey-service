import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSurveyDto } from './dto/create.survey.dto';
import { UpdateSurveyDto } from './dto/update.survey.dto';

@Injectable()
export class SurveysService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: number) {
    return this.prisma.survey.findMany({
      where: {
        authorId: userId,
      },
    });
  }

  async findOne(userId: number, surveyId: number) {
    const survey = await this.prisma.survey.findUnique({
      where: { id: surveyId },
    });

    if (!survey) {
      throw new NotFoundException('Survey not found');
    }

    if (survey.authorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return survey;
  }

  async create(userId: number, dto: CreateSurveyDto) {
    return this.prisma.survey.create({
      data: {
        ...dto,
        authorId: userId,
      },
    });
  }

  async update(userId: number, surveyId: number, dto: UpdateSurveyDto) {
    const survey = await this.prisma.survey.findUnique({
      where: { id: surveyId },
    });

    if (!survey) {
      throw new NotFoundException('Survey not found');
    }

    if (survey.authorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.survey.update({
      where: { id: surveyId },
      data: dto,
    });
  }

  async remove(userId: number, surveyId: number) {
    const survey = await this.prisma.survey.findUnique({
      where: { id: surveyId },
    });

    if (!survey) {
      throw new NotFoundException('Survey not found');
    }

    if (survey.authorId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.survey.delete({
      where: { id: surveyId },
    });
  }
}
