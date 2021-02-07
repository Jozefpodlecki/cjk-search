import { JsonController, Param, Body, Get, Post, Put, Delete } from 'routing-controllers';

@JsonController()
export class Controller {
  @Get('/users')
  getAll() {
    return []
  }

  @Get('/users/:id')
  getOne(@Param('id') id: number) {
    return {}
  }

  @Post('/test')
  post(@Body() user: any) {
    
  }
}