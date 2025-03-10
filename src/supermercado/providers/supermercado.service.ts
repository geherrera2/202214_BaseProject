import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupermercadoEntity } from '../entities/supermercado.entity';
import { BusinessError, BusinessLogicException } from '../../shared/errors/business-errors';

@Injectable()
export class SupermercadoService {

    constructor(
        @InjectRepository(SupermercadoEntity)
        private readonly supermercadoRepository: Repository<SupermercadoEntity>,
    ){}

    public mensajeError = "No se encontró el supermercado con la identificación proporcionada.";

    async create(supermercado: SupermercadoEntity): Promise<SupermercadoEntity> {
        this.validarTamanoNombre(supermercado.nombre);
        return await this.supermercadoRepository.save(supermercado);
    }

    async update(id: string, supermercado: SupermercadoEntity): Promise<SupermercadoEntity> {
            this.validarTamanoNombre(supermercado.nombre);
            const persiteSupermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where:{id:id}, relations:["ciudades"] });
            if (!persiteSupermercado){
                throw new BusinessLogicException(this.mensajeError, BusinessError.NOT_FOUND);
            }
        
            return await this.supermercadoRepository.save({...persiteSupermercado, ...supermercado});
    }

    async delete(id: string) {
        const supermercado: SupermercadoEntity = await this.supermercadoRepository.findOne({where:{id}});
        if (!supermercado)
          throw new BusinessLogicException(this.mensajeError, BusinessError.NOT_FOUND);
     
        await this.supermercadoRepository.remove(supermercado);
    }

    async findOne(id: string): Promise<SupermercadoEntity> {
        const supermercado: SupermercadoEntity =  await this.supermercadoRepository.findOne({where:{id}, relations:["ciudades"] });
        if(!supermercado)
            throw new BusinessLogicException(this.mensajeError, BusinessError.NOT_FOUND);

        return supermercado;
    }

    async findAll(): Promise<SupermercadoEntity[]> {
        return await this.supermercadoRepository.find({relations:["ciudades"] });
    }

    private validarTamanoNombre(nombre: string): void {
        if(nombre.length < 10){
            throw new BusinessLogicException("El tamaño del nombre debe ser mayor a 10 caracteres.", BusinessError.NOT_FOUND);
        }
    }
}
