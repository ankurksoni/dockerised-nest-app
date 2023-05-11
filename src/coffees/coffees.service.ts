import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Connection, Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Coffee } from './entity/coffee.entity';
import { Flavor } from './entity/flavor.entity';
import { Event } from './entity/event.entity';

@Injectable()
export class CoffeesService {

    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepository: Repository<Coffee>,
        @InjectRepository(Flavor)
        private readonly flavorRepository: Repository<Flavor>,
        private readonly connection: Connection
    ) { }

    async findAll(paginationQueryDto: PaginationQueryDto) {
        // return this.coffees;
        // throw new HttpException(, HttpStatus.NOT_FOUND);
        // throw new NotFoundException(`Data not found!`);
        // throw 'adasdasd'
        const { offset, limit } = paginationQueryDto;
        return this.coffeeRepository.find({
            relations: ['flavor'],
            skip: offset,
            take: limit
        });
    }

    async findOne(id: number) {
        const coffee = await this.coffeeRepository.findOne({ where: { id }, relations: ['flavor'] });
        if (!coffee) {
            throw new NotFoundException(`Data not found for id: ${id}`);
        }
        return coffee;
    }

    async create(createCoffeeDTO: CreateCoffeeDto) {
        const flavor = await Promise.all(
            createCoffeeDTO.flavor.map(name => this.preloadFlavorByName(name))
        )

        const saveDTO = this.coffeeRepository.create({ ...createCoffeeDTO, flavor });
        return this.coffeeRepository.save(saveDTO);
    }

    async update(id: number, updateCoffeeDto: UpdateCoffeeDto) {
        const flavor = updateCoffeeDto.flavor && await Promise.all(
            updateCoffeeDto.flavor.map(name => this.preloadFlavorByName(name))
        )
        const updateDTO = await this.coffeeRepository.preload({ id, ...updateCoffeeDto, flavor });
        if (!updateDTO) {
            throw new NotFoundException(`Record with id: ${id} not found for update operation.`);
        }
        return this.coffeeRepository.save(updateDTO);
    }

    async remove(id: number) {
        const deleteDTO = await this.coffeeRepository.findOneBy({ id });
        return this.coffeeRepository.remove(deleteDTO);
    }

    // async recommendCoffee(coffee: Coffee) {
    //     const queryRunner = this.connection.createQueryRunner();

    //     await queryRunner.connect();
    //     await queryRunner.startTransaction();
    //     try {
    //         coffee.recommendations++;

    //         const recommendEvent = new Event();
    //         recommendEvent.name = 'recommend_coffee';
    //         recommendEvent.type = 'coffee';
    //         recommendEvent.payload = { coffeeId: coffee.id };
    //     } catch (err) {
    //         await queryRunner.rollbackTransaction();
    //     } finally {
    //         await queryRunner.release();
    //     }
    // }

    async preloadFlavorByName(name: string) {
        const existingFlavor = await this.flavorRepository.findOne({ where: { name } });
        return existingFlavor ? existingFlavor : this.flavorRepository.create({ name });
    }
}
