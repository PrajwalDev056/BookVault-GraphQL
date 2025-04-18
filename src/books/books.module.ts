import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { BooksResolver } from './books.resolver';
import { Book, BookSchema } from './books.schema';
import { BooksService } from './books.service';
import { AuthorsModule } from '../authors/authors.module';
import { Author, AuthorSchema } from '../authors/authors.schema';
import { AuthorsService } from '../authors/authors.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Book.name, schema: BookSchema },
            { name: Author.name, schema: AuthorSchema },
        ]),
        forwardRef(() => AuthorsModule),
    ],
    providers: [BooksService, BooksResolver, AuthorsService],
})
export class BooksModule {}
