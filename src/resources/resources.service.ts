import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Resource, RESOURCE_TYPE } from './entity/resource.entity';
import { CONST_ROLE_TYPE, User } from '../users/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private readonly resourcesRepository: Repository<Resource>,
  ) {}

  async createResourceContent(requestCreateResourceContentDto: {
    type: RESOURCE_TYPE;
    content: string;
  }) {
    try {
      await this.resourcesRepository.save({
        type: requestCreateResourceContentDto.type,
        content: requestCreateResourceContentDto.content,
      });
      return { message: '리소스가 성공적으로 등록되었습니다' };
    } catch (e) {
      throw e;
    }
  }

  async updateResourceContent(requestUpdateResourceContentDto: {
    type: RESOURCE_TYPE;
    content_id: string;
    content: string;
  }) {
    try {
      const resource = await this.resourcesRepository.findOne({
        where: {
          type: requestUpdateResourceContentDto.type,
          content_id: +requestUpdateResourceContentDto.content_id,
        },
      });
      if (!!!resource) {
        throw new HttpException(
          '존재하지 않는 리소스입니다',
          HttpStatus.BAD_REQUEST,
        );
      }
      resource.content = requestUpdateResourceContentDto.content;
      await this.resourcesRepository.save(resource);
      return { message: '리소스가 성공적으로 업데이트되었습니다' };
    } catch (e) {
      throw e;
    }
  }

  async getAllResources() {
    try {
      return await this.resourcesRepository.find({
        select: ['type', 'content_id', 'content'],
        order: {
          type: 'ASC',
          content_id: 'ASC',
        },
      });
    } catch (e) {
      throw e;
    }
  }

  async getResourceContent(param: { type: string }) {
    try {
      return await this.resourcesRepository.find({
        where: {
          type: param.type as RESOURCE_TYPE,
        },
        select: ['content'],
        order: {
          content_id: 'ASC',
        },
      });
    } catch (e) {
      throw e;
    }
  }

  async deleteResource(
    pathParam: { content_id: string },
    queryParam: { type: string },
  ) {
    try {
      const resource = await this.resourcesRepository.findOne({
        where: {
          type: queryParam.type as RESOURCE_TYPE,
          content_id: +pathParam.content_id,
        },
      });
      const countResources = await this.resourcesRepository.count({
        where: {
          type: queryParam.type as RESOURCE_TYPE,
        },
      });
      if (countResources <= 1) {
        throw new HttpException(
          '기본 리소스는 삭제할 수 없습니다',
          HttpStatus.BAD_REQUEST,
        );
      }
      const result = await this.resourcesRepository.delete(resource);
      if (!(!!result && result.affected === 1)) {
        throw new HttpException(
          '리소스 삭제에 실패하였습니다',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      return { message: '리소스가 성공적으로 삭제되었습니다' };
    } catch (e) {
      throw e;
    }
  }
}
