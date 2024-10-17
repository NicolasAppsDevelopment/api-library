import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Path,
  Post,
  Route, Security,
  Tags,
} from "tsoa";
import {
  BookInputDTO,
  BookInputPatchDTO,
  BookOutputDTO,
} from "../dto/book.dto";
import { bookService } from "../services/book.service";
import { BookCollectionOutputDTO } from "../dto/bookCollection.dto";

@Route("books")
@Tags("Books")
export class BookController extends Controller {
  @Get("/")
  @Security("jwt", ["read:book"])
  public async getAllBooks(): Promise<BookOutputDTO[]> {
    return bookService.getAllBooks();
  }

  @Get("{id}")
  @Security("jwt", ["read:book"])
  public async getBook(@Path("id") id: number): Promise<BookOutputDTO> {
    return await bookService.getBookById(id);
  }

  @Post("/")
  @Security("jwt", ["create:book"])
  public async postBooks(
    @Body() requestBody: BookInputDTO,
  ): Promise<BookOutputDTO> {
    return bookService.createBook(
      requestBody.title,
      requestBody.publish_year,
      requestBody.author_id,
      requestBody.isbn,
    );
  }

  @Patch("{id}")
  @Security("jwt", ["update:book"])
  public async patchBook(
    @Path("id") id: number,
    @Body() requestBody: BookInputPatchDTO,
  ): Promise<BookOutputDTO> {
    return bookService.updateBook(
      id,
      requestBody.title,
      requestBody.publish_year,
      requestBody.author_id,
      requestBody.isbn,
    );
  }

  @Delete("{id}")
  @Security("jwt", ["delete:book"])
  public async deleteBook(@Path("id") id: number): Promise<void> {
    await bookService.deleteBook(id);
  }

  @Get("{id}/book-collections")
  @Security("jwt", ["read:book", "read:collection"])
  public async getBookCollectionsByBookId(
    @Path() id: number,
  ): Promise<BookCollectionOutputDTO[]> {
    return bookService.getBookCollectionsByBookId(id);
  }
}
