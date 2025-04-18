import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RentalsResolver } from './rentals.resolver';
import { Rental, RentalSchema } from './rentals.schema';
import { RentalsService } from './rentals.service';
import { Author, AuthorSchema } from '../authors/authors.schema';
import { AuthorsService } from '../authors/authors.service';
import { Book, BookSchema } from '../books/books.schema';
import { BooksService } from '../books/books.service';
import { User, UserSchema } from '../users/users.schema';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Rental.name, schema: RentalSchema },
      { name: User.name, schema: UserSchema },
      { name: Book.name, schema: BookSchema },
      { name: Author.name, schema: AuthorSchema },
    ]),
  ],
  providers: [RentalsResolver, RentalsService, UsersService, BooksService, AuthorsService],
})
export class RentalsModule {}
