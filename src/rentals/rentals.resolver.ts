import { Resolver, Query, Args, Mutation, ResolveField, Parent } from '@nestjs/graphql';

import { CreateRentalInput, FindRentalInput, Rental } from './rentals.schema';
import { RentalsService } from './rentals.service';
import { Book } from '../books/books.schema';
import { BooksService } from '../books/books.service';
import { User } from '../users/users.schema';
import { UsersService } from '../users/users.service';

@Resolver(() => Rental)
export class RentalsResolver {
    constructor(
        private readonly rentalService: RentalsService,
        private userService: UsersService,
        private bookService: BooksService,
    ) {}

    @Query(() => [Rental], { name: 'rentals' })
    async getAllRentals(@Args('params') params: FindRentalInput): Promise<Rental[] | void> {
        return await this.rentalService.getAllRentals(params);
    }

    @Query(() => Rental, { name: 'rental' })
    async findRentalById(@Args('params') { _id }: FindRentalInput): Promise<Rental | void> {
        return await this.rentalService.findRentalById(_id);
    }

    @Mutation(() => Rental)
    async createRental(@Args('params') user: CreateRentalInput): Promise<Rental> {
        return this.rentalService.createRental(user);
    }

    @Mutation(() => Rental)
    async deleteRental(@Args('id') id: string): Promise<Rental | null> {
        return this.rentalService.deleteRental(id);
    }

    @ResolveField(() => User)
    async userId(@Parent() parent: Rental): Promise<User> {
        return await this.userService.findByRentalId(parent._id);
    }

    @ResolveField(() => [Book])
    async bookIds(@Parent() parent: Rental): Promise<Book[]> {
        return await this.bookService.findByRentalId(parent._id);
    }
}
