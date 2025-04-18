import { Args, Resolver, Query, Mutation, ResolveField, Parent } from '@nestjs/graphql';

import { Author, CreateAuthorInput, FindAuthorInput, UpdateAuthorInput } from './authors.schema';
import { AuthorsService } from './authors.service';
import { Book } from '../books/books.schema';
import { BooksService } from '../books/books.service';

/**
  The resolver decorator marks this class as a GraphQL resolver and specifies that 
  this resolver is for the Author type.
*/
@Resolver(() => Author)
export class AuthorsResolver {
  /** creating instance for author service */
  constructor(
    private readonly authorService: AuthorsService,
    private readonly booksService: BooksService,
  ) {}

  @Query(() => [Author], { name: 'authors' })
  async getAllAuthors(@Args('params') params: FindAuthorInput): Promise<Author[] | void> {
    return await this.authorService.getAllAuthors(params);
  }

  @Query(() => Author, { name: 'author' })
  async findAuthorById(@Args('params') { _id }: FindAuthorInput): Promise<Author | void> {
    return await this.authorService.findAuthorsById(_id);
  }

  /**  
    The mutation decorator marks this method as a GraphQL mutation that returns an 
    Author type. It is used to define a mutation operation for creating a new author.
  */
  @Mutation(() => Author)
  async createAuthor(@Args('params') author: CreateAuthorInput): Promise<Author> {
    return this.authorService.createAuthor(author);
  }

  @Mutation(() => Author)
  async updateAuthor(
    @Args('id') id: string,
    @Args('params') author: UpdateAuthorInput,
  ): Promise<Author> {
    return this.authorService.updateAuthor(id, author);
  }

  @Mutation(() => Author)
  async deleteAuthor(@Args('id') id: string): Promise<Author | null> {
    return this.authorService.deleteAuthor(id);
  }

  @ResolveField(() => [Book])
  async bookIds(@Parent() parent: Author): Promise<Book[]> {
    return await this.booksService.findByAuthorId(parent._id);
  }
}
