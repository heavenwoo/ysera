import { faker } from '@faker-js/faker';
import { Group, Permission, Prisma, PrismaClient, Role, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { random, shuffle } from 'lodash';

export const USER_NUMS = 100;

export const QUESTION_NUMS = 200;

export const ANSWER_NUMS = 10;

export const COMMENT_NUMS = 5;

export const TAG_PER_QUESTION_NUMS = 5;

const tagsRawData: Array<Array<string>> = [
  [
    'php',
    'PHP is an open source, multi-paradigm, dynamically-typed and interpreted scripting language designed initially for server-side web development. Use this tag for questions about programming in the PHP language.',
  ],
  [
    'javascript',
    'For questions about programming in ECMAScript (JavaScript/JS) and its different dialects/implementations (except for ActionScript). Note that JavaScript is NOT Java. Include all tags that are relevant to your question: e.g., [node.js], [jQuery], [JSON], [ReactJS], [angular], [ember.js], [vue.js], [typescript], [svelte], etc.',
  ],
  [
    'typescript',
    'TypeScript is a typed superset of JavaScript that transpiles to plain JavaScript. It adds optional types, classes, interfaces, and modules to JavaScript. This tag is for questions specific to TypeScript. It is not used for general JavaScript questions.',
  ],
  [
    'nestjs',
    'Nest (NestJS) is a framework for building efficient, scalable Node.js server-side applications. It uses progressive JavaScript, is built with and fully supports TypeScript.',
  ],
  [
    'angular',
    'Questions about Angular (not to be confused with AngularJS), the web framework from Google. Use this tag for Angular questions which are not specific to an individual version. For the older AngularJS (1.x) web framework, use the AngularJS tag.',
  ],
  [
    'css',
    'CSS (Cascading Style Sheets) is a representation style sheet language used for describing the look and formatting of HTML (HyperText Markup Language), XML (Extensible Markup Language) documents and SVG elements including (but not limited to) colors, layout, fonts, and animations. It also describes how elements should be rendered on screen, on paper, in speech, or on other media.',
  ],
  [
    'html',
    "HTML (HyperText Markup Language) is the markup language for creating web pages and other information to be displayed in a web browser. Questions regarding HTML should include a minimal reproducible example and some idea of what you're trying to achieve. This tag is rarely used alone and is often paired with CSS and JavaScript.",
  ],
  [
    'python',
    'Python is a dynamically typed, multi-purpose programming language. It is designed to be quick to learn, understand, and use, and enforces a clean and uniform syntax. Please note that Python 2 is officially out of support as of 2020-01-01. For version-specific Python questions, add the [python-2.7] or [python-3.x] tag. When using a Python variant (e.g. Jython, PyPy) or library (e.g. Pandas, NumPy), please include it in the tags.',
  ],
  [
    'android',
    "Android is Google's mobile operating system, used for programming or developing digital devices (Smartphones, Tablets, Automobiles, TVs, Wear, Glass, IoT). For topics related to Android, use Android-specific tags such as android-intent, android-activity, android-adapter, etc. For questions other than development or programming but related to the Android framework, use this link: https://android.stackexchange.com.",
  ],
  [
    'iphone',
    "DO NOT use this tag unless you are addressing Apple's iPhone and/or iPod touch specifically. For questions not dependent on hardware, use the tag [ios]. More tags to consider are [xcode] (but only if the question is about the IDE itself), [swift], [objective-c] or [cocoa-touch] (but not [cocoa]). Please refrain from questions regarding the iTunes App Store or about iTunes Connect. If using C#, tag with [mono].",
  ],
  [
    'ios',
    'iOS is the mobile operating system running on the Apple iPhone, iPod touch, and iPad. Use this tag [ios] for questions related to programming on the iOS platform. Use the related tags [objective-c] and [swift] for issues specific to those programming languages.',
  ],
  [
    'java',
    "Java is a high-level object-oriented programming language. Use this tag when you're having problems using or understanding the language itself. This tag is frequently used alongside other tags for libraries and/or frameworks used by Java developers.",
  ],
  [
    'c#',
    'C# (pronounced "see sharp") is a high-level, statically typed, multi-paradigm programming language developed by Microsoft. C# code usually targets Microsoft\'s .NET family of tools and run-times, which include .NET, .NET Framework, .NET MAUI, and Xamarin among others. Use this tag for questions about code written in C# or about C#\'s formal specification.',
  ],
  [
    'c++',
    'C++ is a general-purpose programming language. Initially, it was designed as an extension to C and has a similar syntax, but it is now a completely different language. Use this tag for questions about code (to be) compiled with a C++ compiler. Use a version-specific tag for questions related to a specific standard revision [C++11], [C++14], [C++17], [C++20], [C++23], or [C++26], etc.',
  ],
  [
    'sql',
    "Structured Query Language (SQL) is a language for querying databases. Questions should include code examples, table structure, sample data, and a tag for the DBMS implementation (e.g. MySQL, PostgreSQL, Oracle, MS SQL Server, IBM DB2, etc.) being used. If your question relates solely to a specific DBMS (uses specific extensions/features), use that DBMS's tag instead. Answers to questions tagged with SQL should use ISO/IEC standard SQL.",
  ],
  [
    'json',
    'JSON (JavaScript Object Notation) is a serializable data interchange format that is a machine and human readable. Do not use this tag for native JavaScript objects or JavaScript object literals. Before you ask a question, validate your JSON using a JSON validator such as JSONLint (https://jsonlint.com).',
  ],
  [
    '.net',
    'Do NOT use for questions about .NET Core - use [.net-core] instead. The .NET framework is a software framework designed mainly for the Microsoft Windows operating system. It includes an implementation of the Base Class Library, Common Language Runtime (commonly referred to as CLR), Common Type System (commonly referred to as CTS) and Dynamic Language Runtime. It supports many programming languages, including C#, VB.NET, F# and C++/CLI.',
  ],
  [
    'prisma',
    'Prisma is a next-generation Node.js and TypeScript ORM for PostgreSQL, MySQL, SQLite, CockroachDB, MongoDB and SQL Server.',
  ],
  ['relay', 'Relay is a JavaScript framework for building data-driven React applications'],
  [
    'ruby',
    'Ruby is a multi-platform open-source, dynamic object-oriented interpreted language. The [ruby] tag is for questions related to the Ruby language, including its syntax and its libraries. Ruby on Rails questions should be tagged with [ruby-on-rails].',
  ],
];

const prisma = new PrismaClient();

const superuserGroupData = {
  name: 'Superuser',
  isActive: true,
};

const seedSuperuserGroup = async () => {
  return prisma.group.upsert({
    where: { name: 'Superuser' },
    update: superuserGroupData,
    create: superuserGroupData,
  });
};

const adminGroupData = {
  name: 'Admin',
  isActive: true,
};

const seedAdminGroup = async () => {
  return prisma.group.upsert({
    where: { name: 'Admin' },
    update: adminGroupData,
    create: adminGroupData,
  });
};

const staffGroupData = {
  name: 'Staff',
  isActive: true,
};

const seedStaffGroup = async () => {
  return prisma.group.upsert({
    where: { name: 'Staff' },
    update: staffGroupData,
    create: staffGroupData,
  });
};

const userGroupData = {
  name: 'User',
  isActive: true,
};

const seedUserGroup = async () => {
  return prisma.group.upsert({
    where: { name: 'User' },
    update: userGroupData,
    create: userGroupData,
  });
};

const seedUsers = async (superuserG: Group, adminG: Group, staffG: Group, userG: Group) => {
  console.log('Start seeding users...');
  const users = await createInitUsers(superuserG, adminG);
  for (let i = 0; i < USER_NUMS; i++) {
    users.push(await createRandomUser(userG));
  }
  const userNums = await prisma.user.createMany({
    data: users,
    skipDuplicates: true,
  });
  console.log(`${userNums.count} users has been created!`);
};

export const createInitUsers = async (
  superuserG: Group,
  adminG: Group
): Promise<Prisma.UserCreateInput[]> => {
  let createdAt = faker.date.past();
  const superUser: Prisma.UserCreateInput = {
    username: 'HeavenWoo',
    firstName: 'Heaven',
    lastName: 'Woo',
    lastLoginAt: new Date(),
    password: await bcrypt.hash('heaven', 10),
    email: 'heavenwoo@live.com',
    isActive: true,
    isVerified: true,
    role: Role.SUPERUSER,
    createdAt,
    updatedAt: createdAt,
    avatar: faker.image.avatarGitHub(),
    groupId: superuserG.id,
    // groups: { connect: { id: superuserG.id } },
    permissions: [Permission.appALL],
  };

  createdAt = faker.date.past();
  const adminUser = {
    username: 'JolieHe',
    firstName: 'Jolie',
    lastName: 'He',
    lastLoginAt: new Date(),
    password: await bcrypt.hash('user', 10),
    email: 'nsx-user@live.com',
    isActive: true,
    isVerified: true,
    role: Role.ADMIN,
    createdAt,
    updatedAt: createdAt,
    avatar: faker.image.avatarGitHub(),
    groupId: adminG.id,
    // groups: { connect: { id: adminG.id } },
    permissions: [
      Permission.groupALL,
      Permission.userCREATE,
      Permission.userREAD,
      Permission.userUPDATE,
      Permission.groupREAD,
    ],
  };

  return [superUser, adminUser];
};

export const createRandomUser = async (userG: Group): Promise<Prisma.UserCreateInput> => {
  const createdAt = faker.date.past();
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    username: firstName + ' ' + lastName,
    firstName,
    lastName,
    lastLoginAt: new Date(),
    password: await bcrypt.hash(faker.lorem.word(), 10),
    email: faker.internet.email({ firstName }),
    isActive: faker.datatype.boolean(),
    isVerified: faker.datatype.boolean(),
    role: Role.USER,
    createdAt,
    updatedAt: createdAt,
    avatar: faker.image.avatarGitHub(),
    groupId: userG.id,
    // groups: { connect: { id: userG.id } },
    permissions: [
      Permission.userCREATE,
      Permission.userREAD,
      Permission.userUPDATE,
      Permission.userDELETE,
    ],
  };
};

// const getRandomUser = async () => {
//   const allUsers = await prisma.user.findMany();
//   const shuffleUsers = shuffle(allUsers);
//   // console.log('shuffleUsers', shuffleUsers);
//   return shuffleUsers[0];
// };

const getRandomUserWhereUniqueInputs = (
  num: number,
  allUsers: User[],
  currentUserId: string
): Prisma.UserWhereUniqueInput[] => {
  const shuffleUsers = shuffle(allUsers).filter((user) => user.id !== currentUserId);
  const users: Prisma.UserWhereUniqueInput[] = [];
  for (let i = 0; i < num; i++) {
    users.push({ id: shuffleUsers[i].id });
  }
  return users;
};

const removeFollowers = async () => {
  (await prisma.user.findMany()).map(async ({ id }) => {
    await prisma.user.update({
      where: { id },
      data: {
        // followedBy: { set: [] },
        following: { set: [] },
      },
    });
  });
};

const updateUsers = async () => {
  const allUsers = await prisma.user.findMany();
  allUsers.map(async ({ id }) => {
    await prisma.user.update({
      where: { id },
      data: {
        // followedBy: { connect: getRandomUserWhereUniqueInputs(random(20), allUsers) },
        following: {
          connect: getRandomUserWhereUniqueInputs(random(20), allUsers, id),
        },
      },
    });
  });
};

const userRelations = async () => {
  // await prisma.user.update({
  //   where: { id: 'cllmfkep10004hzi30t7iw3vv' },
  //   data: {
  //     followedBy: { set: [] },
  //     following: { connect: { id: 'cllmfmjyo001rhzuukiio6vdc' } },
  //   },
  // });
  const users = await prisma.user.findMany({
    where: { id: 'cllmfmjyo001rhzuukiio6vdc' },
    include: {
      followedBy: true,
      following: true,
    },
  });
  console.log(users);
};
const userAddAvatar = async () => {
  const users = await prisma.user.findMany({});
  users.map(async (user) => {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        avatar: faker.image.avatarGitHub(),
      },
    });
  });
};
const main = async () => {
  console.log('Start seeding...');

  const superuserG = await seedSuperuserGroup();
  const adminG = await seedAdminGroup();
  const staffG = await seedStaffGroup();
  const userG = await seedUserGroup();
  await seedUsers(superuserG, adminG, staffG, userG);
  await removeFollowers();
  await updateUsers();
  // await userRelations();
  await userAddAvatar();
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
