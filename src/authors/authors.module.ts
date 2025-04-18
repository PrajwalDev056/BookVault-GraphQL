import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthorsResolver } from './authors.resolver';
import { Author, AuthorSchema } from './authors.schema';
import { AuthorsService } from './authors.service';
import { BooksModule } from '../books/books.module';
import { Book, BookSchema } from '../books/books.schema';
import { BooksService } from '../books/books.service';

@Module({
  /**
    This forFeature method is used to define which models should be registered in the 
    current module. It takes an array of objects, each containing a name and a schema.
  */
  imports: [
    MongooseModule.forFeature([
      { name: Author.name, schema: AuthorSchema },
      { name: Book.name, schema: BookSchema },
    ]),
    forwardRef(() => BooksModule),
  ],
  providers: [AuthorsService, AuthorsResolver, BooksService],
})
export class AuthorsModule {}
