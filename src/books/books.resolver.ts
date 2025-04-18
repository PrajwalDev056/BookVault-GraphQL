import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';

import { Book, CreateBookInput, FindBookInput, UpdateBookInput } from './books.schema';
import { BooksService } from './books.service';
import { Author } from '../authors/authors.schema';
import { AuthorsService } from '../authors/authors.service';

@Resolver(() => Book)
export class BooksResolver {
  constructor(
    private readonly bookService: BooksService,
    private authorService: AuthorsService,
  ) {}

  @Query(() => [Book], { name: 'books' })
  async getAllBooks(@Args('params') params: FindBookInput): Promise<Book[] | void> {
    return await this.bookService.getAllBooks(params);
  }

  @Query(() => Book, { name: 'book' })
  async findBookById(@Args('params') { _id }: FindBookInput): Promise<Book | void> {
    return await this.bookService.findBookById(_id);
  }

  @Mutation(() => Book)
  async createBook(@Args('params') author: CreateBookInput): Promise<Book> {
    return this.bookService.createBook(author);
  }

  @Mutation(() => Book)
  async updateBook(@Args('id') id: string, @Args('params') author: UpdateBookInput): Promise<Book> {
    return this.bookService.updateBook(id, author);
  }

  @Mutation(() => Book)
  async deleteBook(@Args('id') id: string): Promise<Book | null> {
    return this.bookService.deleteBook(id);
  }

  @ResolveField(() => [Author])
  async authorIds(@Parent() parent: Book): Promise<Author[]> {
    return await this.authorService.findByBookId(parent._id);
  }
}
