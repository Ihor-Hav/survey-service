import {
  Controller,
  Delete,
  Get,
  Post,
  Param,
  Body,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { ResponsesService } from './responses.service';
import { CreateResponseDto } from './dto/create.response.dto';

@Controller('questions/:questionId/responses')
export class ResponsesController {
  constructor(private readonly responsesService: ResponsesService) {}

  @Get()
  findAll(@Param('questionId', ParseIntPipe) questionId: number) {
    return this.responsesService.findAll(questionId);
  }

  @Post()
  create(
    @Param('questionId') questionId: string,
    @Body() dto: CreateResponseDto,
  ) {
    return this.responsesService.create(+questionId, dto);
  }

  @Patch(':responseId')
  update(
    @Param('responseId', ParseIntPipe) responseId: number,
    @Body() dto: any,
  ) {
    return this.responsesService.update();
  }

  @Delete(':responseId')
  remove(@Param('responseId', ParseIntPipe) responseId: number) {
    return this.responsesService.delete(responseId);
  }
}
