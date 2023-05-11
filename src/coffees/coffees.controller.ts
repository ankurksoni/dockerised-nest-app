import { Controller, Get, Param, Post, Body, HttpCode, HttpStatus, Query, Patch, Delete } from '@nestjs/common';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';

@Controller('coffees')
export class CoffeesController {

    constructor(private readonly coffeeService: CoffeesService) { }

    @Get()
    async findAll(@Query() paginationquery: PaginationQueryDto) {
        // const { limit, offset } = paginationquery;
        // return `limit: ${limit}, offset: ${offset}`;
        return this.coffeeService.findAll(paginationquery);
    }

    @Get('/:id')
    async findOne(@Param('id') id: number) {
        return this.coffeeService.findOne(id);
    }

    @Post()
    @HttpCode(HttpStatus.GONE)
    async create(@Body() createCoffeeDTO: CreateCoffeeDto) {
        console.log(createCoffeeDTO instanceof CreateCoffeeDto);
        return this.coffeeService.create(createCoffeeDTO);
    }

    @Patch(':id')
    async update(@Param('id') id: number, @Body() updateCoffeeDto: UpdateCoffeeDto) {
        return this.coffeeService.update(id, updateCoffeeDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        const coffee = await this.findOne(id);
        return this.coffeeService.remove(id);
    }
}
