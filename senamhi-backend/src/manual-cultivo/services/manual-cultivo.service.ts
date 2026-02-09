import { Injectable } from '@nestjs/common';
import { BaseService } from './base.service';
import { Cultive } from '../interfaces/cultive.interface';

@Injectable()
export class ManualCultivoService extends BaseService<Cultive> {}
