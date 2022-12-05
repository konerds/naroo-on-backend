import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from './guard/jwt.guard';
import { UsersService } from './users.service';
import { ROLE_TYPE, User } from './entity/user.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { GetUser } from './decorator/get-user.decorator';
import { AdminUserGuard } from './guard/admin-user.guard';
import { StudentUserGuard } from './guard/student-user.guard';
import { InitPasswordDto } from './dto/init-password.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.usersService.signUp(signUpDto);
  }

  @Post('/signin')
  signIn(@Body() signInDto: SignInDto) {
    return this.usersService.signIn(signInDto);
  }

  @Get('verify')
  verifyCode(@Query() param: { requestToken: string }) {
    return this.usersService.verifyCode(param);
  }

  @Post('/init')
  sendInitPassword(@Body() initPasswordDto: InitPasswordDto) {
    return this.usersService.sendInitPassword(initPasswordDto);
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  getMe(@GetUser() user: User) {
    return this.usersService.getMe(user);
  }

  @Get('/myinfo')
  @UseGuards(StudentUserGuard)
  getMyInfo(@GetUser() user: User) {
    return this.usersService.getMyInfo(user);
  }

  @Get('/admin/user')
  @UseGuards(AdminUserGuard)
  findAllUsers(@GetUser() user: User) {
    return this.usersService.findAllUsers();
  }

  @Put('/admin/:userId')
  @UseGuards(JwtAuthGuard)
  updateUserInfo(
    @Param() param: { userId: string },
    @GetUser() user: User,
    @Body()
    updateUserInfoDto: {
      email: string | null;
      nickname: string | null;
      password: string | null;
      phone: string | null;
      role: ROLE_TYPE | null;
      introduce: string | null;
    },
  ) {
    return this.usersService.updateUserInfo(param, user, updateUserInfoDto);
  }

  @Delete('/admin/:userId')
  @UseGuards(JwtAuthGuard)
  deleteUser(@Param() param: { userId: string }, @GetUser() user: User) {
    return this.usersService.deleteUser(param, user);
  }
}
