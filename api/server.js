// src/app.ts
import express7 from "express";

// src/module/medicine/medicine.route.ts
import express from "express";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

// src/generated/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// src/generated/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.8.0",
  "engineVersion": "3c6e192761c0362d496ed980de936e2f3cebcd3a",
  "activeProvider": "postgresql",
  "inlineSchema": 'model Address {\n  id String @id @default(uuid())\n\n  fullName   String\n  phone      String\n  city       String\n  area       String?\n  street     String?\n  houseNo    String?\n  postalCode String?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  orders Order[]\n\n  @@unique([id, userId])\n  @@map("address")\n}\n\nmodel Admin {\n  id            String    @id @default(uuid(7))\n  name          String\n  email         String    @unique\n  profilePhoto  String?\n  contactNumber String?\n  isDeleted     Boolean   @default(false)\n  deletedAt     DateTime?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  @@index([email])\n  @@index([isDeleted])\n  @@map("admins")\n}\n\nmodel User {\n  id                 String    @id\n  name               String\n  email              String\n  emailVerified      Boolean   @default(false)\n  needPasswordChange Boolean   @default(false)\n  isDeleted          Boolean   @default(false)\n  deletedAt          DateTime?\n  image              String?\n  createdAt          DateTime  @default(now())\n  updatedAt          DateTime  @updatedAt\n  sessions           Session[]\n  accounts           Account[]\n  cart               Cart[]\n  address            Address?\n\n  role       Role?       @default(CUSTOMER)\n  userStatus UserStatus? @default(ACTIVE)\n\n  payments Payment[]\n  customer Customer?\n  seller   Seller?\n  admin    Admin?\n\n  @@unique([email])\n  @@map("user")\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n\nmodel Cart {\n  id     String @id @default(uuid())\n  userId String\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  medicineId String\n  medicine   Medicine @relation(fields: [medicineId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  quantity  Int      @default(1)\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@unique([userId, medicineId])\n  @@map("carts")\n}\n\nmodel Category {\n  id           String     @id @default(uuid())\n  medicines    Medicine[]\n  categoryName String     @unique\n  description  String?\n\n  @@map("categories")\n}\n\nmodel Customer {\n  id String @id @default(uuid(7))\n\n  name          String\n  email         String    @unique\n  profilePhoto  String?\n  contactNumber String?\n  address       String?\n  isDeleted     Boolean   @default(false)\n  deletedAt     DateTime?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n\n  //relations\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  @@index([email], name: "idx_customer_email")\n  @@index([isDeleted], name: "idx_customer_isDeleted")\n  @@map("customer")\n}\n\nenum Rating {\n  ONE\n  TWO\n  THREE\n  FOUR\n  FIVE\n}\n\nenum UserStatus {\n  ACTIVE\n  DELETED\n  BLOCKED\n}\n\nenum OrderStatus {\n  PENDING\n  CONFIRMED\n  SHIPPED\n  DELIVERED\n  CANCELLED\n}\n\nenum Role {\n  CUSTOMER\n  SELLER\n  ADMIN\n}\n\nenum PaymentStatus {\n  PAID\n  UNPAID\n  CANCELLED\n}\n\nmodel Medicine {\n  id           String   @id @default(uuid())\n  name         String   @unique\n  price        Int\n  stock        Int\n  image        String?\n  categoryId   String\n  category     Category @relation(fields: [categoryId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n  categoryName String\n  orders       Order[]\n  reviews      Review[]\n  cart         Cart[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("medicines")\n}\n\nmodel Order {\n  id          String @id @default(uuid())\n  totalAmount Int\n  quantity    Int\n  userId      String\n\n  medicineId String\n  medicine   Medicine @relation(fields: [medicineId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  addressId String\n  address   Address @relation(fields: [addressId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  orderStatus   OrderStatus   @default(PENDING)\n  paymentStatus PaymentStatus @default(UNPAID)\n  createdAt     DateTime      @default(now())\n\n  payment Payment?\n\n  @@map("orders")\n}\n\nmodel Payment {\n  id            String        @id @default(uuid(7))\n  amount        Float\n  transactionId String        @unique @db.Uuid()\n  stripeEventId String?       @unique\n  status        PaymentStatus @default(UNPAID)\n\n  orderId String @unique\n  order   Order  @relation(fields: [orderId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n  userId  String\n  user    User   @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([transactionId])\n  @@map("payments")\n}\n\nmodel Review {\n  id          String   @id @default(uuid())\n  userId      String\n  medicineId  String\n  medicine    Medicine @relation(fields: [medicineId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n  rating      Rating?\n  description String\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@map("reviews")\n}\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../../src/generated"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel Seller {\n  id String @id @default(uuid(7))\n\n  name          String\n  email         String    @unique\n  profilePhoto  String?\n  contactNumber String?\n  address       String?\n  isDeleted     Boolean   @default(false)\n  deletedAt     DateTime?\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n\n  //relations\n\n  userId String @unique\n  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)\n\n  @@index([email], name: "idx_seller_email")\n  @@index([isDeleted], name: "idx_seller_isDeleted")\n  @@map("seller")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"Address":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"fullName","kind":"scalar","type":"String"},{"name":"phone","kind":"scalar","type":"String"},{"name":"city","kind":"scalar","type":"String"},{"name":"area","kind":"scalar","type":"String"},{"name":"street","kind":"scalar","type":"String"},{"name":"houseNo","kind":"scalar","type":"String"},{"name":"postalCode","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AddressToUser"},{"name":"orders","kind":"object","type":"Order","relationName":"AddressToOrder"}],"dbName":"address"},"Admin":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"contactNumber","kind":"scalar","type":"String"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AdminToUser"}],"dbName":"admins"},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"needPasswordChange","kind":"scalar","type":"Boolean"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"image","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToUser"},{"name":"address","kind":"object","type":"Address","relationName":"AddressToUser"},{"name":"role","kind":"enum","type":"Role"},{"name":"userStatus","kind":"enum","type":"UserStatus"},{"name":"payments","kind":"object","type":"Payment","relationName":"PaymentToUser"},{"name":"customer","kind":"object","type":"Customer","relationName":"CustomerToUser"},{"name":"seller","kind":"object","type":"Seller","relationName":"SellerToUser"},{"name":"admin","kind":"object","type":"Admin","relationName":"AdminToUser"}],"dbName":"user"},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"},"Cart":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"CartToUser"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"CartToMedicine"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"carts"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"CategoryToMedicine"},{"name":"categoryName","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"}],"dbName":"categories"},"Customer":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"contactNumber","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"CustomerToUser"}],"dbName":"customer"},"Medicine":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Int"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"image","kind":"scalar","type":"String"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMedicine"},{"name":"categoryName","kind":"scalar","type":"String"},{"name":"orders","kind":"object","type":"Order","relationName":"MedicineToOrder"},{"name":"reviews","kind":"object","type":"Review","relationName":"MedicineToReview"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToMedicine"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"medicines"},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"totalAmount","kind":"scalar","type":"Int"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"userId","kind":"scalar","type":"String"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToOrder"},{"name":"addressId","kind":"scalar","type":"String"},{"name":"address","kind":"object","type":"Address","relationName":"AddressToOrder"},{"name":"orderStatus","kind":"enum","type":"OrderStatus"},{"name":"paymentStatus","kind":"enum","type":"PaymentStatus"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"payment","kind":"object","type":"Payment","relationName":"OrderToPayment"}],"dbName":"orders"},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Float"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"stripeEventId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToPayment"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"PaymentToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"payments"},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToReview"},{"name":"rating","kind":"enum","type":"Rating"},{"name":"description","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"reviews"},"Seller":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"profilePhoto","kind":"scalar","type":"String"},{"name":"contactNumber","kind":"scalar","type":"String"},{"name":"address","kind":"scalar","type":"String"},{"name":"isDeleted","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SellerToUser"}],"dbName":"seller"}},"enums":{},"types":{}}');
config.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","user","sessions","accounts","medicines","_count","category","medicine","address","order","payment","orders","reviews","cart","payments","customer","seller","admin","Address.findUnique","Address.findUniqueOrThrow","Address.findFirst","Address.findFirstOrThrow","Address.findMany","data","Address.createOne","Address.createMany","Address.createManyAndReturn","Address.updateOne","Address.updateMany","Address.updateManyAndReturn","create","update","Address.upsertOne","Address.deleteOne","Address.deleteMany","having","_min","_max","Address.groupBy","Address.aggregate","Admin.findUnique","Admin.findUniqueOrThrow","Admin.findFirst","Admin.findFirstOrThrow","Admin.findMany","Admin.createOne","Admin.createMany","Admin.createManyAndReturn","Admin.updateOne","Admin.updateMany","Admin.updateManyAndReturn","Admin.upsertOne","Admin.deleteOne","Admin.deleteMany","Admin.groupBy","Admin.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","Session.findUnique","Session.findUniqueOrThrow","Session.findFirst","Session.findFirstOrThrow","Session.findMany","Session.createOne","Session.createMany","Session.createManyAndReturn","Session.updateOne","Session.updateMany","Session.updateManyAndReturn","Session.upsertOne","Session.deleteOne","Session.deleteMany","Session.groupBy","Session.aggregate","Account.findUnique","Account.findUniqueOrThrow","Account.findFirst","Account.findFirstOrThrow","Account.findMany","Account.createOne","Account.createMany","Account.createManyAndReturn","Account.updateOne","Account.updateMany","Account.updateManyAndReturn","Account.upsertOne","Account.deleteOne","Account.deleteMany","Account.groupBy","Account.aggregate","Verification.findUnique","Verification.findUniqueOrThrow","Verification.findFirst","Verification.findFirstOrThrow","Verification.findMany","Verification.createOne","Verification.createMany","Verification.createManyAndReturn","Verification.updateOne","Verification.updateMany","Verification.updateManyAndReturn","Verification.upsertOne","Verification.deleteOne","Verification.deleteMany","Verification.groupBy","Verification.aggregate","Cart.findUnique","Cart.findUniqueOrThrow","Cart.findFirst","Cart.findFirstOrThrow","Cart.findMany","Cart.createOne","Cart.createMany","Cart.createManyAndReturn","Cart.updateOne","Cart.updateMany","Cart.updateManyAndReturn","Cart.upsertOne","Cart.deleteOne","Cart.deleteMany","_avg","_sum","Cart.groupBy","Cart.aggregate","Category.findUnique","Category.findUniqueOrThrow","Category.findFirst","Category.findFirstOrThrow","Category.findMany","Category.createOne","Category.createMany","Category.createManyAndReturn","Category.updateOne","Category.updateMany","Category.updateManyAndReturn","Category.upsertOne","Category.deleteOne","Category.deleteMany","Category.groupBy","Category.aggregate","Customer.findUnique","Customer.findUniqueOrThrow","Customer.findFirst","Customer.findFirstOrThrow","Customer.findMany","Customer.createOne","Customer.createMany","Customer.createManyAndReturn","Customer.updateOne","Customer.updateMany","Customer.updateManyAndReturn","Customer.upsertOne","Customer.deleteOne","Customer.deleteMany","Customer.groupBy","Customer.aggregate","Medicine.findUnique","Medicine.findUniqueOrThrow","Medicine.findFirst","Medicine.findFirstOrThrow","Medicine.findMany","Medicine.createOne","Medicine.createMany","Medicine.createManyAndReturn","Medicine.updateOne","Medicine.updateMany","Medicine.updateManyAndReturn","Medicine.upsertOne","Medicine.deleteOne","Medicine.deleteMany","Medicine.groupBy","Medicine.aggregate","Order.findUnique","Order.findUniqueOrThrow","Order.findFirst","Order.findFirstOrThrow","Order.findMany","Order.createOne","Order.createMany","Order.createManyAndReturn","Order.updateOne","Order.updateMany","Order.updateManyAndReturn","Order.upsertOne","Order.deleteOne","Order.deleteMany","Order.groupBy","Order.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","Review.findUnique","Review.findUniqueOrThrow","Review.findFirst","Review.findFirstOrThrow","Review.findMany","Review.createOne","Review.createMany","Review.createManyAndReturn","Review.updateOne","Review.updateMany","Review.updateManyAndReturn","Review.upsertOne","Review.deleteOne","Review.deleteMany","Review.groupBy","Review.aggregate","Seller.findUnique","Seller.findUniqueOrThrow","Seller.findFirst","Seller.findFirstOrThrow","Seller.findMany","Seller.createOne","Seller.createMany","Seller.createManyAndReturn","Seller.updateOne","Seller.updateMany","Seller.updateManyAndReturn","Seller.upsertOne","Seller.deleteOne","Seller.deleteMany","Seller.groupBy","Seller.aggregate","AND","OR","NOT","id","name","email","profilePhoto","contactNumber","isDeleted","deletedAt","createdAt","updatedAt","userId","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","medicineId","Rating","rating","description","amount","transactionId","stripeEventId","PaymentStatus","status","orderId","totalAmount","quantity","addressId","OrderStatus","orderStatus","paymentStatus","price","stock","image","categoryId","categoryName","every","some","none","identifier","value","expiresAt","accountId","providerId","accessToken","refreshToken","idToken","accessTokenExpiresAt","refreshTokenExpiresAt","scope","password","token","ipAddress","userAgent","emailVerified","needPasswordChange","Role","role","UserStatus","userStatus","fullName","phone","city","area","street","houseNo","postalCode","userId_medicineId","id_userId","is","isNot","connectOrCreate","upsert","disconnect","delete","connect","createMany","set","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "rgZ94AERAwAAjgMAIA0AAMcDACD8AQAAxgMAMP0BAAAiABD-AQAAxgMAMP8BAQAAAAGGAkAAjQMAIYcCQACNAwAhiAIBAAAAAcECAQCJAwAhwgIBAIkDACHDAgEAiQMAIcQCAQCKAwAhxQIBAIoDACHGAgEAigMAIccCAQCKAwAhyQIAANkDACABAAAAAQAgDAMAAI4DACD8AQAA2AMAMP0BAAADABD-AQAA2AMAMP8BAQCJAwAhhgJAAI0DACGHAkAAjQMAIYgCAQCJAwAhrgJAAI0DACG4AgEAiQMAIbkCAQCKAwAhugIBAIoDACEDAwAA5QMAILkCAADaAwAgugIAANoDACAMAwAAjgMAIPwBAADYAwAw_QEAAAMAEP4BAADYAwAw_wEBAAAAAYYCQACNAwAhhwJAAI0DACGIAgEAiQMAIa4CQACNAwAhuAIBAAAAAbkCAQCKAwAhugIBAIoDACEDAAAAAwAgAQAABAAwAgAABQAgEQMAAI4DACD8AQAA1wMAMP0BAAAHABD-AQAA1wMAMP8BAQCJAwAhhgJAAI0DACGHAkAAjQMAIYgCAQCJAwAhrwIBAIkDACGwAgEAiQMAIbECAQCKAwAhsgIBAIoDACGzAgEAigMAIbQCQACMAwAhtQJAAIwDACG2AgEAigMAIbcCAQCKAwAhCAMAAOUDACCxAgAA2gMAILICAADaAwAgswIAANoDACC0AgAA2gMAILUCAADaAwAgtgIAANoDACC3AgAA2gMAIBEDAACOAwAg_AEAANcDADD9AQAABwAQ_gEAANcDADD_AQEAAAABhgJAAI0DACGHAkAAjQMAIYgCAQCJAwAhrwIBAIkDACGwAgEAiQMAIbECAQCKAwAhsgIBAIoDACGzAgEAigMAIbQCQACMAwAhtQJAAIwDACG2AgEAigMAIbcCAQCKAwAhAwAAAAcAIAEAAAgAMAIAAAkAIAsDAACOAwAgCQAAygMAIPwBAADWAwAw_QEAAAsAEP4BAADWAwAw_wEBAIkDACGGAkAAjQMAIYcCQACNAwAhiAIBAIkDACGUAgEAiQMAIZ8CAgDOAwAhAgMAAOUDACAJAADcBQAgDAMAAI4DACAJAADKAwAg_AEAANYDADD9AQAACwAQ_gEAANYDADD_AQEAAAABhgJAAI0DACGHAkAAjQMAIYgCAQCJAwAhlAIBAIkDACGfAgIAzgMAIcgCAADVAwAgAwAAAAsAIAEAAAwAMAIAAA0AIBAIAADTAwAgDQAAxwMAIA4AANQDACAPAAC5AwAg_AEAANIDADD9AQAADwAQ_gEAANIDADD_AQEAiQMAIYACAQCJAwAhhgJAAI0DACGHAkAAjQMAIaQCAgDOAwAhpQICAM4DACGmAgEAigMAIacCAQCJAwAhqAIBAIkDACEFCAAA3gUAIA0AANoFACAOAADfBQAgDwAAygUAIKYCAADaAwAgEAgAANMDACANAADHAwAgDgAA1AMAIA8AALkDACD8AQAA0gMAMP0BAAAPABD-AQAA0gMAMP8BAQAAAAGAAgEAAAABhgJAAI0DACGHAkAAjQMAIaQCAgDOAwAhpQICAM4DACGmAgEAigMAIacCAQCJAwAhqAIBAIkDACEDAAAADwAgAQAAEAAwAgAAEQAgAQAAAA8AIA8JAADKAwAgCgAA0AMAIAwAANEDACD8AQAAzQMAMP0BAAAUABD-AQAAzQMAMP8BAQCJAwAhhgJAAI0DACGIAgEAiQMAIZQCAQCJAwAhngICAM4DACGfAgIAzgMAIaACAQCJAwAhogIAAM8DogIiowIAAMQDnAIiAwkAANwFACAKAADLBQAgDAAA3QUAIA8JAADKAwAgCgAA0AMAIAwAANEDACD8AQAAzQMAMP0BAAAUABD-AQAAzQMAMP8BAQAAAAGGAkAAjQMAIYgCAQCJAwAhlAIBAIkDACGeAgIAzgMAIZ8CAgDOAwAhoAIBAIkDACGiAgAAzwOiAiKjAgAAxAOcAiIDAAAAFAAgAQAAFQAwAgAAFgAgDgMAAI4DACALAADFAwAg_AEAAMIDADD9AQAAGAAQ_gEAAMIDADD_AQEAiQMAIYYCQACNAwAhhwJAAI0DACGIAgEAiQMAIZgCCADDAwAhmQIBAMsDACGaAgEAigMAIZwCAADEA5wCIp0CAQCJAwAhAQAAABgAIAsJAADKAwAg_AEAAMgDADD9AQAAGgAQ_gEAAMgDADD_AQEAiQMAIYYCQACNAwAhhwJAAI0DACGIAgEAiQMAIZQCAQCJAwAhlgIAAMkDlgIjlwIBAIkDACECCQAA3AUAIJYCAADaAwAgCwkAAMoDACD8AQAAyAMAMP0BAAAaABD-AQAAyAMAMP8BAQAAAAGGAkAAjQMAIYcCQACNAwAhiAIBAIkDACGUAgEAiQMAIZYCAADJA5YCI5cCAQCJAwAhAwAAABoAIAEAABsAMAIAABwAIAMAAAALACABAAAMADACAAANACABAAAAFAAgAQAAABoAIAEAAAALACAQAwAAjgMAIA0AAMcDACD8AQAAxgMAMP0BAAAiABD-AQAAxgMAMP8BAQCJAwAhhgJAAI0DACGHAkAAjQMAIYgCAQCJAwAhwQIBAIkDACHCAgEAiQMAIcMCAQCJAwAhxAIBAIoDACHFAgEAigMAIcYCAQCKAwAhxwIBAIoDACEBAAAAIgAgAwMAAOUDACALAADbBQAgmgIAANoDACAOAwAAjgMAIAsAAMUDACD8AQAAwgMAMP0BAAAYABD-AQAAwgMAMP8BAQAAAAGGAkAAjQMAIYcCQACNAwAhiAIBAIkDACGYAggAwwMAIZkCAQAAAAGaAgEAAAABnAIAAMQDnAIinQIBAAAAAQMAAAAYACABAAAkADACAAAlACAPAwAAjgMAIAoBAIoDACH8AQAApAMAMP0BAAAnABD-AQAApAMAMP8BAQCJAwAhgAIBAIkDACGBAgEAiQMAIYICAQCKAwAhgwIBAIoDACGEAiAAiwMAIYUCQACMAwAhhgJAAI0DACGHAkAAjQMAIYgCAQCJAwAhAQAAACcAIA8DAACOAwAgCgEAigMAIfwBAACIAwAw_QEAACkAEP4BAACIAwAw_wEBAIkDACGAAgEAiQMAIYECAQCJAwAhggIBAIoDACGDAgEAigMAIYQCIACLAwAhhQJAAIwDACGGAkAAjQMAIYcCQACNAwAhiAIBAIkDACEBAAAAKQAgDgMAAI4DACD8AQAAwAMAMP0BAAArABD-AQAAwAMAMP8BAQCJAwAhgAIBAIkDACGBAgEAiQMAIYICAQCKAwAhgwIBAIoDACGEAiAAiwMAIYUCQACMAwAhhgJAAI0DACGHAkAAjQMAIYgCAQCJAwAhAQAAACsAIAEAAAADACABAAAABwAgAQAAAAsAIAEAAAAYACADAAAAFAAgAQAAFQAwAgAAFgAgAQAAABQAIAEAAAABACAGAwAA5QMAIA0AANoFACDEAgAA2gMAIMUCAADaAwAgxgIAANoDACDHAgAA2gMAIAMAAAAiACABAAA0ADACAAABACADAAAAIgAgAQAANAAwAgAAAQAgAwAAACIAIAEAADQAMAIAAAEAIA0DAADZBQAgDQAAngUAIP8BAQAAAAGGAkAAAAABhwJAAAAAAYgCAQAAAAHBAgEAAAABwgIBAAAAAcMCAQAAAAHEAgEAAAABxQIBAAAAAcYCAQAAAAHHAgEAAAABARkAADgAIAv_AQEAAAABhgJAAAAAAYcCQAAAAAGIAgEAAAABwQIBAAAAAcICAQAAAAHDAgEAAAABxAIBAAAAAcUCAQAAAAHGAgEAAAABxwIBAAAAAQEZAAA6ADABGQAAOgAwDQMAANgFACANAACUBQAg_wEBAN4DACGGAkAA4gMAIYcCQADiAwAhiAIBAN4DACHBAgEA3gMAIcICAQDeAwAhwwIBAN4DACHEAgEA3wMAIcUCAQDfAwAhxgIBAN8DACHHAgEA3wMAIQIAAAABACAZAAA9ACAL_wEBAN4DACGGAkAA4gMAIYcCQADiAwAhiAIBAN4DACHBAgEA3gMAIcICAQDeAwAhwwIBAN4DACHEAgEA3wMAIcUCAQDfAwAhxgIBAN8DACHHAgEA3wMAIQIAAAAiACAZAAA_ACACAAAAIgAgGQAAPwAgAwAAAAEAICAAADgAICEAAD0AIAEAAAABACABAAAAIgAgBwcAANUFACAmAADXBQAgJwAA1gUAIMQCAADaAwAgxQIAANoDACDGAgAA2gMAIMcCAADaAwAgDvwBAADBAwAw_QEAAEYAEP4BAADBAwAw_wEBAPcCACGGAkAA-wIAIYcCQAD7AgAhiAIBAPcCACHBAgEA9wIAIcICAQD3AgAhwwIBAPcCACHEAgEA-AIAIcUCAQD4AgAhxgIBAPgCACHHAgEA-AIAIQMAAAAiACABAABFADAlAABGACADAAAAIgAgAQAANAAwAgAAAQAgDgMAAI4DACD8AQAAwAMAMP0BAAArABD-AQAAwAMAMP8BAQAAAAGAAgEAiQMAIYECAQAAAAGCAgEAigMAIYMCAQCKAwAhhAIgAIsDACGFAkAAjAMAIYYCQACNAwAhhwJAAI0DACGIAgEAAAABAQAAAEkAIAEAAABJACAEAwAA5QMAIIICAADaAwAggwIAANoDACCFAgAA2gMAIAMAAAArACABAABMADACAABJACADAAAAKwAgAQAATAAwAgAASQAgAwAAACsAIAEAAEwAMAIAAEkAIAsDAADUBQAg_wEBAAAAAYACAQAAAAGBAgEAAAABggIBAAAAAYMCAQAAAAGEAiAAAAABhQJAAAAAAYYCQAAAAAGHAkAAAAABiAIBAAAAAQEZAABQACAK_wEBAAAAAYACAQAAAAGBAgEAAAABggIBAAAAAYMCAQAAAAGEAiAAAAABhQJAAAAAAYYCQAAAAAGHAkAAAAABiAIBAAAAAQEZAABSADABGQAAUgAwCwMAANMFACD_AQEA3gMAIYACAQDeAwAhgQIBAN4DACGCAgEA3wMAIYMCAQDfAwAhhAIgAOADACGFAkAA4QMAIYYCQADiAwAhhwJAAOIDACGIAgEA3gMAIQIAAABJACAZAABVACAK_wEBAN4DACGAAgEA3gMAIYECAQDeAwAhggIBAN8DACGDAgEA3wMAIYQCIADgAwAhhQJAAOEDACGGAkAA4gMAIYcCQADiAwAhiAIBAN4DACECAAAAKwAgGQAAVwAgAgAAACsAIBkAAFcAIAMAAABJACAgAABQACAhAABVACABAAAASQAgAQAAACsAIAYHAADQBQAgJgAA0gUAICcAANEFACCCAgAA2gMAIIMCAADaAwAghQIAANoDACAN_AEAAL8DADD9AQAAXgAQ_gEAAL8DADD_AQEA9wIAIYACAQD3AgAhgQIBAPcCACGCAgEA-AIAIYMCAQD4AgAhhAIgAPkCACGFAkAA-gIAIYYCQAD7AgAhhwJAAPsCACGIAgEA9wIAIQMAAAArACABAABdADAlAABeACADAAAAKwAgAQAATAAwAgAASQAgFwQAALcDACAFAAC4AwAgCgAAugMAIA8AALkDACAQAAC7AwAgEQAAvAMAIBIAAL0DACATAAC-AwAg_AEAALQDADD9AQAAZAAQ_gEAALQDADD_AQEAAAABgAIBAIkDACGBAgEAAAABhAIgAIsDACGFAkAAjAMAIYYCQACNAwAhhwJAAI0DACGmAgEAigMAIbsCIACLAwAhvAIgAIsDACG-AgAAtQO-AiPAAgAAtgPAAiMBAAAAYQAgAQAAAGEAIBcEAAC3AwAgBQAAuAMAIAoAALoDACAPAAC5AwAgEAAAuwMAIBEAALwDACASAAC9AwAgEwAAvgMAIPwBAAC0AwAw_QEAAGQAEP4BAAC0AwAw_wEBAIkDACGAAgEAiQMAIYECAQCJAwAhhAIgAIsDACGFAkAAjAMAIYYCQACNAwAhhwJAAI0DACGmAgEAigMAIbsCIACLAwAhvAIgAIsDACG-AgAAtQO-AiPAAgAAtgPAAiMMBAAAyAUAIAUAAMkFACAKAADLBQAgDwAAygUAIBAAAMwFACARAADNBQAgEgAAzgUAIBMAAM8FACCFAgAA2gMAIKYCAADaAwAgvgIAANoDACDAAgAA2gMAIAMAAABkACABAABlADACAABhACADAAAAZAAgAQAAZQAwAgAAYQAgAwAAAGQAIAEAAGUAMAIAAGEAIBQEAADABQAgBQAAwQUAIAoAAMMFACAPAADCBQAgEAAAxAUAIBEAAMUFACASAADGBQAgEwAAxwUAIP8BAQAAAAGAAgEAAAABgQIBAAAAAYQCIAAAAAGFAkAAAAABhgJAAAAAAYcCQAAAAAGmAgEAAAABuwIgAAAAAbwCIAAAAAG-AgAAAL4CA8ACAAAAwAIDARkAAGkAIAz_AQEAAAABgAIBAAAAAYECAQAAAAGEAiAAAAABhQJAAAAAAYYCQAAAAAGHAkAAAAABpgIBAAAAAbsCIAAAAAG8AiAAAAABvgIAAAC-AgPAAgAAAMACAwEZAABrADABGQAAawAwFAQAAOwEACAFAADtBAAgCgAA7wQAIA8AAO4EACAQAADwBAAgEQAA8QQAIBIAAPIEACATAADzBAAg_wEBAN4DACGAAgEA3gMAIYECAQDeAwAhhAIgAOADACGFAkAA4QMAIYYCQADiAwAhhwJAAOIDACGmAgEA3wMAIbsCIADgAwAhvAIgAOADACG-AgAA6gS-AiPAAgAA6wTAAiMCAAAAYQAgGQAAbgAgDP8BAQDeAwAhgAIBAN4DACGBAgEA3gMAIYQCIADgAwAhhQJAAOEDACGGAkAA4gMAIYcCQADiAwAhpgIBAN8DACG7AiAA4AMAIbwCIADgAwAhvgIAAOoEvgIjwAIAAOsEwAIjAgAAAGQAIBkAAHAAIAIAAABkACAZAABwACADAAAAYQAgIAAAaQAgIQAAbgAgAQAAAGEAIAEAAABkACAHBwAA5wQAICYAAOkEACAnAADoBAAghQIAANoDACCmAgAA2gMAIL4CAADaAwAgwAIAANoDACAP_AEAAK0DADD9AQAAdwAQ_gEAAK0DADD_AQEA9wIAIYACAQD3AgAhgQIBAPcCACGEAiAA-QIAIYUCQAD6AgAhhgJAAPsCACGHAkAA-wIAIaYCAQD4AgAhuwIgAPkCACG8AiAA-QIAIb4CAACuA74CI8ACAACvA8ACIwMAAABkACABAAB2ADAlAAB3ACADAAAAZAAgAQAAZQAwAgAAYQAgAQAAAAUAIAEAAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACAJAwAA5gQAIP8BAQAAAAGGAkAAAAABhwJAAAAAAYgCAQAAAAGuAkAAAAABuAIBAAAAAbkCAQAAAAG6AgEAAAABARkAAH8AIAj_AQEAAAABhgJAAAAAAYcCQAAAAAGIAgEAAAABrgJAAAAAAbgCAQAAAAG5AgEAAAABugIBAAAAAQEZAACBAQAwARkAAIEBADAJAwAA5QQAIP8BAQDeAwAhhgJAAOIDACGHAkAA4gMAIYgCAQDeAwAhrgJAAOIDACG4AgEA3gMAIbkCAQDfAwAhugIBAN8DACECAAAABQAgGQAAhAEAIAj_AQEA3gMAIYYCQADiAwAhhwJAAOIDACGIAgEA3gMAIa4CQADiAwAhuAIBAN4DACG5AgEA3wMAIboCAQDfAwAhAgAAAAMAIBkAAIYBACACAAAAAwAgGQAAhgEAIAMAAAAFACAgAAB_ACAhAACEAQAgAQAAAAUAIAEAAAADACAFBwAA4gQAICYAAOQEACAnAADjBAAguQIAANoDACC6AgAA2gMAIAv8AQAArAMAMP0BAACNAQAQ_gEAAKwDADD_AQEA9wIAIYYCQAD7AgAhhwJAAPsCACGIAgEA9wIAIa4CQAD7AgAhuAIBAPcCACG5AgEA-AIAIboCAQD4AgAhAwAAAAMAIAEAAIwBADAlAACNAQAgAwAAAAMAIAEAAAQAMAIAAAUAIAEAAAAJACABAAAACQAgAwAAAAcAIAEAAAgAMAIAAAkAIAMAAAAHACABAAAIADACAAAJACADAAAABwAgAQAACAAwAgAACQAgDgMAAOEEACD_AQEAAAABhgJAAAAAAYcCQAAAAAGIAgEAAAABrwIBAAAAAbACAQAAAAGxAgEAAAABsgIBAAAAAbMCAQAAAAG0AkAAAAABtQJAAAAAAbYCAQAAAAG3AgEAAAABARkAAJUBACAN_wEBAAAAAYYCQAAAAAGHAkAAAAABiAIBAAAAAa8CAQAAAAGwAgEAAAABsQIBAAAAAbICAQAAAAGzAgEAAAABtAJAAAAAAbUCQAAAAAG2AgEAAAABtwIBAAAAAQEZAACXAQAwARkAAJcBADAOAwAA4AQAIP8BAQDeAwAhhgJAAOIDACGHAkAA4gMAIYgCAQDeAwAhrwIBAN4DACGwAgEA3gMAIbECAQDfAwAhsgIBAN8DACGzAgEA3wMAIbQCQADhAwAhtQJAAOEDACG2AgEA3wMAIbcCAQDfAwAhAgAAAAkAIBkAAJoBACAN_wEBAN4DACGGAkAA4gMAIYcCQADiAwAhiAIBAN4DACGvAgEA3gMAIbACAQDeAwAhsQIBAN8DACGyAgEA3wMAIbMCAQDfAwAhtAJAAOEDACG1AkAA4QMAIbYCAQDfAwAhtwIBAN8DACECAAAABwAgGQAAnAEAIAIAAAAHACAZAACcAQAgAwAAAAkAICAAAJUBACAhAACaAQAgAQAAAAkAIAEAAAAHACAKBwAA3QQAICYAAN8EACAnAADeBAAgsQIAANoDACCyAgAA2gMAILMCAADaAwAgtAIAANoDACC1AgAA2gMAILYCAADaAwAgtwIAANoDACAQ_AEAAKsDADD9AQAAowEAEP4BAACrAwAw_wEBAPcCACGGAkAA-wIAIYcCQAD7AgAhiAIBAPcCACGvAgEA9wIAIbACAQD3AgAhsQIBAPgCACGyAgEA-AIAIbMCAQD4AgAhtAJAAPoCACG1AkAA-gIAIbYCAQD4AgAhtwIBAPgCACEDAAAABwAgAQAAogEAMCUAAKMBACADAAAABwAgAQAACAAwAgAACQAgCfwBAACqAwAw_QEAAKkBABD-AQAAqgMAMP8BAQAAAAGGAkAAjQMAIYcCQACNAwAhrAIBAIkDACGtAgEAiQMAIa4CQACNAwAhAQAAAKYBACABAAAApgEAIAn8AQAAqgMAMP0BAACpAQAQ_gEAAKoDADD_AQEAiQMAIYYCQACNAwAhhwJAAI0DACGsAgEAiQMAIa0CAQCJAwAhrgJAAI0DACEAAwAAAKkBACABAACqAQAwAgAApgEAIAMAAACpAQAgAQAAqgEAMAIAAKYBACADAAAAqQEAIAEAAKoBADACAACmAQAgBv8BAQAAAAGGAkAAAAABhwJAAAAAAawCAQAAAAGtAgEAAAABrgJAAAAAAQEZAACuAQAgBv8BAQAAAAGGAkAAAAABhwJAAAAAAawCAQAAAAGtAgEAAAABrgJAAAAAAQEZAACwAQAwARkAALABADAG_wEBAN4DACGGAkAA4gMAIYcCQADiAwAhrAIBAN4DACGtAgEA3gMAIa4CQADiAwAhAgAAAKYBACAZAACzAQAgBv8BAQDeAwAhhgJAAOIDACGHAkAA4gMAIawCAQDeAwAhrQIBAN4DACGuAkAA4gMAIQIAAACpAQAgGQAAtQEAIAIAAACpAQAgGQAAtQEAIAMAAACmAQAgIAAArgEAICEAALMBACABAAAApgEAIAEAAACpAQAgAwcAANoEACAmAADcBAAgJwAA2wQAIAn8AQAAqQMAMP0BAAC8AQAQ_gEAAKkDADD_AQEA9wIAIYYCQAD7AgAhhwJAAPsCACGsAgEA9wIAIa0CAQD3AgAhrgJAAPsCACEDAAAAqQEAIAEAALsBADAlAAC8AQAgAwAAAKkBACABAACqAQAwAgAApgEAIAEAAAANACABAAAADQAgAwAAAAsAIAEAAAwAMAIAAA0AIAMAAAALACABAAAMADACAAANACADAAAACwAgAQAADAAwAgAADQAgCAMAAJ8EACAJAADZBAAg_wEBAAAAAYYCQAAAAAGHAkAAAAABiAIBAAAAAZQCAQAAAAGfAgIAAAABARkAAMQBACAG_wEBAAAAAYYCQAAAAAGHAkAAAAABiAIBAAAAAZQCAQAAAAGfAgIAAAABARkAAMYBADABGQAAxgEAMAgDAACdBAAgCQAA2AQAIP8BAQDeAwAhhgJAAOIDACGHAkAA4gMAIYgCAQDeAwAhlAIBAN4DACGfAgIA_AMAIQIAAAANACAZAADJAQAgBv8BAQDeAwAhhgJAAOIDACGHAkAA4gMAIYgCAQDeAwAhlAIBAN4DACGfAgIA_AMAIQIAAAALACAZAADLAQAgAgAAAAsAIBkAAMsBACADAAAADQAgIAAAxAEAICEAAMkBACABAAAADQAgAQAAAAsAIAUHAADTBAAgJgAA1gQAICcAANUEACCIAQAA1AQAIIkBAADXBAAgCfwBAACoAwAw_QEAANIBABD-AQAAqAMAMP8BAQD3AgAhhgJAAPsCACGHAkAA-wIAIYgCAQD3AgAhlAIBAPcCACGfAgIAnQMAIQMAAAALACABAADRAQAwJQAA0gEAIAMAAAALACABAAAMADACAAANACAHBgAApwMAIPwBAACmAwAw_QEAANgBABD-AQAApgMAMP8BAQAAAAGXAgEAigMAIagCAQAAAAEBAAAA1QEAIAEAAADVAQAgBwYAAKcDACD8AQAApgMAMP0BAADYAQAQ_gEAAKYDADD_AQEAiQMAIZcCAQCKAwAhqAIBAIkDACECBgAA0gQAIJcCAADaAwAgAwAAANgBACABAADZAQAwAgAA1QEAIAMAAADYAQAgAQAA2QEAMAIAANUBACADAAAA2AEAIAEAANkBADACAADVAQAgBAYAANEEACD_AQEAAAABlwIBAAAAAagCAQAAAAEBGQAA3QEAIAP_AQEAAAABlwIBAAAAAagCAQAAAAEBGQAA3wEAMAEZAADfAQAwBAYAAMQEACD_AQEA3gMAIZcCAQDfAwAhqAIBAN4DACECAAAA1QEAIBkAAOIBACAD_wEBAN4DACGXAgEA3wMAIagCAQDeAwAhAgAAANgBACAZAADkAQAgAgAAANgBACAZAADkAQAgAwAAANUBACAgAADdAQAgIQAA4gEAIAEAAADVAQAgAQAAANgBACAEBwAAwQQAICYAAMMEACAnAADCBAAglwIAANoDACAG_AEAAKUDADD9AQAA6wEAEP4BAAClAwAw_wEBAPcCACGXAgEA-AIAIagCAQD3AgAhAwAAANgBACABAADqAQAwJQAA6wEAIAMAAADYAQAgAQAA2QEAMAIAANUBACAPAwAAjgMAIAoBAIoDACH8AQAApAMAMP0BAAAnABD-AQAApAMAMP8BAQAAAAGAAgEAiQMAIYECAQAAAAGCAgEAigMAIYMCAQCKAwAhhAIgAIsDACGFAkAAjAMAIYYCQACNAwAhhwJAAI0DACGIAgEAAAABAQAAAO4BACABAAAA7gEAIAUDAADlAwAgCgAA2gMAIIICAADaAwAggwIAANoDACCFAgAA2gMAIAMAAAAnACABAADxAQAwAgAA7gEAIAMAAAAnACABAADxAQAwAgAA7gEAIAMAAAAnACABAADxAQAwAgAA7gEAIAwDAADABAAgCgEAAAAB_wEBAAAAAYACAQAAAAGBAgEAAAABggIBAAAAAYMCAQAAAAGEAiAAAAABhQJAAAAAAYYCQAAAAAGHAkAAAAABiAIBAAAAAQEZAAD1AQAgCwoBAAAAAf8BAQAAAAGAAgEAAAABgQIBAAAAAYICAQAAAAGDAgEAAAABhAIgAAAAAYUCQAAAAAGGAkAAAAABhwJAAAAAAYgCAQAAAAEBGQAA9wEAMAEZAAD3AQAwDAMAAL8EACAKAQDfAwAh_wEBAN4DACGAAgEA3gMAIYECAQDeAwAhggIBAN8DACGDAgEA3wMAIYQCIADgAwAhhQJAAOEDACGGAkAA4gMAIYcCQADiAwAhiAIBAN4DACECAAAA7gEAIBkAAPoBACALCgEA3wMAIf8BAQDeAwAhgAIBAN4DACGBAgEA3gMAIYICAQDfAwAhgwIBAN8DACGEAiAA4AMAIYUCQADhAwAhhgJAAOIDACGHAkAA4gMAIYgCAQDeAwAhAgAAACcAIBkAAPwBACACAAAAJwAgGQAA_AEAIAMAAADuAQAgIAAA9QEAICEAAPoBACABAAAA7gEAIAEAAAAnACAHBwAAvAQAIAoAANoDACAmAAC-BAAgJwAAvQQAIIICAADaAwAggwIAANoDACCFAgAA2gMAIA4KAQD4AgAh_AEAAKMDADD9AQAAgwIAEP4BAACjAwAw_wEBAPcCACGAAgEA9wIAIYECAQD3AgAhggIBAPgCACGDAgEA-AIAIYQCIAD5AgAhhQJAAPoCACGGAkAA-wIAIYcCQAD7AgAhiAIBAPcCACEDAAAAJwAgAQAAggIAMCUAAIMCACADAAAAJwAgAQAA8QEAMAIAAO4BACABAAAAEQAgAQAAABEAIAMAAAAPACABAAAQADACAAARACADAAAADwAgAQAAEAAwAgAAEQAgAwAAAA8AIAEAABAAMAIAABEAIA0IAAC4BAAgDQAAuQQAIA4AALoEACAPAAC7BAAg_wEBAAAAAYACAQAAAAGGAkAAAAABhwJAAAAAAaQCAgAAAAGlAgIAAAABpgIBAAAAAacCAQAAAAGoAgEAAAABARkAAIsCACAJ_wEBAAAAAYACAQAAAAGGAkAAAAABhwJAAAAAAaQCAgAAAAGlAgIAAAABpgIBAAAAAacCAQAAAAGoAgEAAAABARkAAI0CADABGQAAjQIAMA0IAACOBAAgDQAAjwQAIA4AAJAEACAPAACRBAAg_wEBAN4DACGAAgEA3gMAIYYCQADiAwAhhwJAAOIDACGkAgIA_AMAIaUCAgD8AwAhpgIBAN8DACGnAgEA3gMAIagCAQDeAwAhAgAAABEAIBkAAJACACAJ_wEBAN4DACGAAgEA3gMAIYYCQADiAwAhhwJAAOIDACGkAgIA_AMAIaUCAgD8AwAhpgIBAN8DACGnAgEA3gMAIagCAQDeAwAhAgAAAA8AIBkAAJICACACAAAADwAgGQAAkgIAIAMAAAARACAgAACLAgAgIQAAkAIAIAEAAAARACABAAAADwAgBgcAAIkEACAmAACMBAAgJwAAiwQAIIgBAACKBAAgiQEAAI0EACCmAgAA2gMAIAz8AQAAogMAMP0BAACZAgAQ_gEAAKIDADD_AQEA9wIAIYACAQD3AgAhhgJAAPsCACGHAkAA-wIAIaQCAgCdAwAhpQICAJ0DACGmAgEA-AIAIacCAQD3AgAhqAIBAPcCACEDAAAADwAgAQAAmAIAMCUAAJkCACADAAAADwAgAQAAEAAwAgAAEQAgAQAAABYAIAEAAAAWACADAAAAFAAgAQAAFQAwAgAAFgAgAwAAABQAIAEAABUAMAIAABYAIAMAAAAUACABAAAVADACAAAWACAMCQAAhgQAIAoAAIcEACAMAACIBAAg_wEBAAAAAYYCQAAAAAGIAgEAAAABlAIBAAAAAZ4CAgAAAAGfAgIAAAABoAIBAAAAAaICAAAAogICowIAAACcAgIBGQAAoQIAIAn_AQEAAAABhgJAAAAAAYgCAQAAAAGUAgEAAAABngICAAAAAZ8CAgAAAAGgAgEAAAABogIAAACiAgKjAgAAAJwCAgEZAACjAgAwARkAAKMCADAMCQAA_gMAIAoAAP8DACAMAACABAAg_wEBAN4DACGGAkAA4gMAIYgCAQDeAwAhlAIBAN4DACGeAgIA_AMAIZ8CAgD8AwAhoAIBAN4DACGiAgAA_QOiAiKjAgAA8gOcAiICAAAAFgAgGQAApgIAIAn_AQEA3gMAIYYCQADiAwAhiAIBAN4DACGUAgEA3gMAIZ4CAgD8AwAhnwICAPwDACGgAgEA3gMAIaICAAD9A6ICIqMCAADyA5wCIgIAAAAUACAZAACoAgAgAgAAABQAIBkAAKgCACADAAAAFgAgIAAAoQIAICEAAKYCACABAAAAFgAgAQAAABQAIAUHAAD3AwAgJgAA-gMAICcAAPkDACCIAQAA-AMAIIkBAAD7AwAgDPwBAACcAwAw_QEAAK8CABD-AQAAnAMAMP8BAQD3AgAhhgJAAPsCACGIAgEA9wIAIZQCAQD3AgAhngICAJ0DACGfAgIAnQMAIaACAQD3AgAhogIAAJ4DogIiowIAAJYDnAIiAwAAABQAIAEAAK4CADAlAACvAgAgAwAAABQAIAEAABUAMAIAABYAIAEAAAAlACABAAAAJQAgAwAAABgAIAEAACQAMAIAACUAIAMAAAAYACABAAAkADACAAAlACADAAAAGAAgAQAAJAAwAgAAJQAgCwMAAPYDACALAAD1AwAg_wEBAAAAAYYCQAAAAAGHAkAAAAABiAIBAAAAAZgCCAAAAAGZAgEAAAABmgIBAAAAAZwCAAAAnAICnQIBAAAAAQEZAAC3AgAgCf8BAQAAAAGGAkAAAAABhwJAAAAAAYgCAQAAAAGYAggAAAABmQIBAAAAAZoCAQAAAAGcAgAAAJwCAp0CAQAAAAEBGQAAuQIAMAEZAAC5AgAwCwMAAPQDACALAADzAwAg_wEBAN4DACGGAkAA4gMAIYcCQADiAwAhiAIBAN4DACGYAggA8QMAIZkCAQDeAwAhmgIBAN8DACGcAgAA8gOcAiKdAgEA3gMAIQIAAAAlACAZAAC8AgAgCf8BAQDeAwAhhgJAAOIDACGHAkAA4gMAIYgCAQDeAwAhmAIIAPEDACGZAgEA3gMAIZoCAQDfAwAhnAIAAPIDnAIinQIBAN4DACECAAAAGAAgGQAAvgIAIAIAAAAYACAZAAC-AgAgAwAAACUAICAAALcCACAhAAC8AgAgAQAAACUAIAEAAAAYACAGBwAA7AMAICYAAO8DACAnAADuAwAgiAEAAO0DACCJAQAA8AMAIJoCAADaAwAgDPwBAACTAwAw_QEAAMUCABD-AQAAkwMAMP8BAQD3AgAhhgJAAPsCACGHAkAA-wIAIYgCAQD3AgAhmAIIAJQDACGZAgEAlQMAIZoCAQD4AgAhnAIAAJYDnAIinQIBAPcCACEDAAAAGAAgAQAAxAIAMCUAAMUCACADAAAAGAAgAQAAJAAwAgAAJQAgAQAAABwAIAEAAAAcACADAAAAGgAgAQAAGwAwAgAAHAAgAwAAABoAIAEAABsAMAIAABwAIAMAAAAaACABAAAbADACAAAcACAICQAA6wMAIP8BAQAAAAGGAkAAAAABhwJAAAAAAYgCAQAAAAGUAgEAAAABlgIAAACWAgOXAgEAAAABARkAAM0CACAH_wEBAAAAAYYCQAAAAAGHAkAAAAABiAIBAAAAAZQCAQAAAAGWAgAAAJYCA5cCAQAAAAEBGQAAzwIAMAEZAADPAgAwCAkAAOoDACD_AQEA3gMAIYYCQADiAwAhhwJAAOIDACGIAgEA3gMAIZQCAQDeAwAhlgIAAOkDlgIjlwIBAN4DACECAAAAHAAgGQAA0gIAIAf_AQEA3gMAIYYCQADiAwAhhwJAAOIDACGIAgEA3gMAIZQCAQDeAwAhlgIAAOkDlgIjlwIBAN4DACECAAAAGgAgGQAA1AIAIAIAAAAaACAZAADUAgAgAwAAABwAICAAAM0CACAhAADSAgAgAQAAABwAIAEAAAAaACAEBwAA5gMAICYAAOgDACAnAADnAwAglgIAANoDACAK_AEAAI8DADD9AQAA2wIAEP4BAACPAwAw_wEBAPcCACGGAkAA-wIAIYcCQAD7AgAhiAIBAPcCACGUAgEA9wIAIZYCAACQA5YCI5cCAQD3AgAhAwAAABoAIAEAANoCADAlAADbAgAgAwAAABoAIAEAABsAMAIAABwAIA8DAACOAwAgCgEAigMAIfwBAACIAwAw_QEAACkAEP4BAACIAwAw_wEBAAAAAYACAQCJAwAhgQIBAAAAAYICAQCKAwAhgwIBAIoDACGEAiAAiwMAIYUCQACMAwAhhgJAAI0DACGHAkAAjQMAIYgCAQAAAAEBAAAA3gIAIAEAAADeAgAgBQMAAOUDACAKAADaAwAgggIAANoDACCDAgAA2gMAIIUCAADaAwAgAwAAACkAIAEAAOECADACAADeAgAgAwAAACkAIAEAAOECADACAADeAgAgAwAAACkAIAEAAOECADACAADeAgAgDAMAAOQDACAKAQAAAAH_AQEAAAABgAIBAAAAAYECAQAAAAGCAgEAAAABgwIBAAAAAYQCIAAAAAGFAkAAAAABhgJAAAAAAYcCQAAAAAGIAgEAAAABARkAAOUCACALCgEAAAAB_wEBAAAAAYACAQAAAAGBAgEAAAABggIBAAAAAYMCAQAAAAGEAiAAAAABhQJAAAAAAYYCQAAAAAGHAkAAAAABiAIBAAAAAQEZAADnAgAwARkAAOcCADAMAwAA4wMAIAoBAN8DACH_AQEA3gMAIYACAQDeAwAhgQIBAN4DACGCAgEA3wMAIYMCAQDfAwAhhAIgAOADACGFAkAA4QMAIYYCQADiAwAhhwJAAOIDACGIAgEA3gMAIQIAAADeAgAgGQAA6gIAIAsKAQDfAwAh_wEBAN4DACGAAgEA3gMAIYECAQDeAwAhggIBAN8DACGDAgEA3wMAIYQCIADgAwAhhQJAAOEDACGGAkAA4gMAIYcCQADiAwAhiAIBAN4DACECAAAAKQAgGQAA7AIAIAIAAAApACAZAADsAgAgAwAAAN4CACAgAADlAgAgIQAA6gIAIAEAAADeAgAgAQAAACkAIAcHAADbAwAgCgAA2gMAICYAAN0DACAnAADcAwAgggIAANoDACCDAgAA2gMAIIUCAADaAwAgDgoBAPgCACH8AQAA9gIAMP0BAADzAgAQ_gEAAPYCADD_AQEA9wIAIYACAQD3AgAhgQIBAPcCACGCAgEA-AIAIYMCAQD4AgAhhAIgAPkCACGFAkAA-gIAIYYCQAD7AgAhhwJAAPsCACGIAgEA9wIAIQMAAAApACABAADyAgAwJQAA8wIAIAMAAAApACABAADhAgAwAgAA3gIAIA4KAQD4AgAh_AEAAPYCADD9AQAA8wIAEP4BAAD2AgAw_wEBAPcCACGAAgEA9wIAIYECAQD3AgAhggIBAPgCACGDAgEA-AIAIYQCIAD5AgAhhQJAAPoCACGGAkAA-wIAIYcCQAD7AgAhiAIBAPcCACEOBwAA_QIAICYAAIcDACAnAACHAwAgiQIBAAAAAYoCAQAAAASLAgEAAAAEjAIBAAAAAY0CAQAAAAGOAgEAAAABjwIBAAAAAZACAQCGAwAhkQIBAAAAAZICAQAAAAGTAgEAAAABDgcAAIADACAmAACFAwAgJwAAhQMAIIkCAQAAAAGKAgEAAAAFiwIBAAAABYwCAQAAAAGNAgEAAAABjgIBAAAAAY8CAQAAAAGQAgEAhAMAIZECAQAAAAGSAgEAAAABkwIBAAAAAQUHAAD9AgAgJgAAgwMAICcAAIMDACCJAiAAAAABkAIgAIIDACELBwAAgAMAICYAAIEDACAnAACBAwAgiQJAAAAAAYoCQAAAAAWLAkAAAAAFjAJAAAAAAY0CQAAAAAGOAkAAAAABjwJAAAAAAZACQAD_AgAhCwcAAP0CACAmAAD-AgAgJwAA_gIAIIkCQAAAAAGKAkAAAAAEiwJAAAAABIwCQAAAAAGNAkAAAAABjgJAAAAAAY8CQAAAAAGQAkAA_AIAIQsHAAD9AgAgJgAA_gIAICcAAP4CACCJAkAAAAABigJAAAAABIsCQAAAAASMAkAAAAABjQJAAAAAAY4CQAAAAAGPAkAAAAABkAJAAPwCACEIiQICAAAAAYoCAgAAAASLAgIAAAAEjAICAAAAAY0CAgAAAAGOAgIAAAABjwICAAAAAZACAgD9AgAhCIkCQAAAAAGKAkAAAAAEiwJAAAAABIwCQAAAAAGNAkAAAAABjgJAAAAAAY8CQAAAAAGQAkAA_gIAIQsHAACAAwAgJgAAgQMAICcAAIEDACCJAkAAAAABigJAAAAABYsCQAAAAAWMAkAAAAABjQJAAAAAAY4CQAAAAAGPAkAAAAABkAJAAP8CACEIiQICAAAAAYoCAgAAAAWLAgIAAAAFjAICAAAAAY0CAgAAAAGOAgIAAAABjwICAAAAAZACAgCAAwAhCIkCQAAAAAGKAkAAAAAFiwJAAAAABYwCQAAAAAGNAkAAAAABjgJAAAAAAY8CQAAAAAGQAkAAgQMAIQUHAAD9AgAgJgAAgwMAICcAAIMDACCJAiAAAAABkAIgAIIDACECiQIgAAAAAZACIACDAwAhDgcAAIADACAmAACFAwAgJwAAhQMAIIkCAQAAAAGKAgEAAAAFiwIBAAAABYwCAQAAAAGNAgEAAAABjgIBAAAAAY8CAQAAAAGQAgEAhAMAIZECAQAAAAGSAgEAAAABkwIBAAAAAQuJAgEAAAABigIBAAAABYsCAQAAAAWMAgEAAAABjQIBAAAAAY4CAQAAAAGPAgEAAAABkAIBAIUDACGRAgEAAAABkgIBAAAAAZMCAQAAAAEOBwAA_QIAICYAAIcDACAnAACHAwAgiQIBAAAAAYoCAQAAAASLAgEAAAAEjAIBAAAAAY0CAQAAAAGOAgEAAAABjwIBAAAAAZACAQCGAwAhkQIBAAAAAZICAQAAAAGTAgEAAAABC4kCAQAAAAGKAgEAAAAEiwIBAAAABIwCAQAAAAGNAgEAAAABjgIBAAAAAY8CAQAAAAGQAgEAhwMAIZECAQAAAAGSAgEAAAABkwIBAAAAAQ8DAACOAwAgCgEAigMAIfwBAACIAwAw_QEAACkAEP4BAACIAwAw_wEBAIkDACGAAgEAiQMAIYECAQCJAwAhggIBAIoDACGDAgEAigMAIYQCIACLAwAhhQJAAIwDACGGAkAAjQMAIYcCQACNAwAhiAIBAIkDACELiQIBAAAAAYoCAQAAAASLAgEAAAAEjAIBAAAAAY0CAQAAAAGOAgEAAAABjwIBAAAAAZACAQCHAwAhkQIBAAAAAZICAQAAAAGTAgEAAAABC4kCAQAAAAGKAgEAAAAFiwIBAAAABYwCAQAAAAGNAgEAAAABjgIBAAAAAY8CAQAAAAGQAgEAhQMAIZECAQAAAAGSAgEAAAABkwIBAAAAAQKJAiAAAAABkAIgAIMDACEIiQJAAAAAAYoCQAAAAAWLAkAAAAAFjAJAAAAAAY0CQAAAAAGOAkAAAAABjwJAAAAAAZACQACBAwAhCIkCQAAAAAGKAkAAAAAEiwJAAAAABIwCQAAAAAGNAkAAAAABjgJAAAAAAY8CQAAAAAGQAkAA_gIAIRkEAAC3AwAgBQAAuAMAIAoAALoDACAPAAC5AwAgEAAAuwMAIBEAALwDACASAAC9AwAgEwAAvgMAIPwBAAC0AwAw_QEAAGQAEP4BAAC0AwAw_wEBAIkDACGAAgEAiQMAIYECAQCJAwAhhAIgAIsDACGFAkAAjAMAIYYCQACNAwAhhwJAAI0DACGmAgEAigMAIbsCIACLAwAhvAIgAIsDACG-AgAAtQO-AiPAAgAAtgPAAiPKAgAAZAAgywIAAGQAIAr8AQAAjwMAMP0BAADbAgAQ_gEAAI8DADD_AQEA9wIAIYYCQAD7AgAhhwJAAPsCACGIAgEA9wIAIZQCAQD3AgAhlgIAAJADlgIjlwIBAPcCACEHBwAAgAMAICYAAJIDACAnAACSAwAgiQIAAACWAgOKAgAAAJYCCYsCAAAAlgIJkAIAAJEDlgIjBwcAAIADACAmAACSAwAgJwAAkgMAIIkCAAAAlgIDigIAAACWAgmLAgAAAJYCCZACAACRA5YCIwSJAgAAAJYCA4oCAAAAlgIJiwIAAACWAgmQAgAAkgOWAiMM_AEAAJMDADD9AQAAxQIAEP4BAACTAwAw_wEBAPcCACGGAkAA-wIAIYcCQAD7AgAhiAIBAPcCACGYAggAlAMAIZkCAQCVAwAhmgIBAPgCACGcAgAAlgOcAiKdAgEA9wIAIQ0HAAD9AgAgJgAAmwMAICcAAJsDACCIAQAAmwMAIIkBAACbAwAgiQIIAAAAAYoCCAAAAASLAggAAAAEjAIIAAAAAY0CCAAAAAGOAggAAAABjwIIAAAAAZACCACaAwAhCwcAAP0CACAmAACHAwAgJwAAhwMAIIkCAQAAAAGKAgEAAAAEiwIBAAAABIwCAQAAAAGNAgEAAAABjgIBAAAAAY8CAQAAAAGQAgEAmQMAIQcHAAD9AgAgJgAAmAMAICcAAJgDACCJAgAAAJwCAooCAAAAnAIIiwIAAACcAgiQAgAAlwOcAiIHBwAA_QIAICYAAJgDACAnAACYAwAgiQIAAACcAgKKAgAAAJwCCIsCAAAAnAIIkAIAAJcDnAIiBIkCAAAAnAICigIAAACcAgiLAgAAAJwCCJACAACYA5wCIgsHAAD9AgAgJgAAhwMAICcAAIcDACCJAgEAAAABigIBAAAABIsCAQAAAASMAgEAAAABjQIBAAAAAY4CAQAAAAGPAgEAAAABkAIBAJkDACENBwAA_QIAICYAAJsDACAnAACbAwAgiAEAAJsDACCJAQAAmwMAIIkCCAAAAAGKAggAAAAEiwIIAAAABIwCCAAAAAGNAggAAAABjgIIAAAAAY8CCAAAAAGQAggAmgMAIQiJAggAAAABigIIAAAABIsCCAAAAASMAggAAAABjQIIAAAAAY4CCAAAAAGPAggAAAABkAIIAJsDACEM_AEAAJwDADD9AQAArwIAEP4BAACcAwAw_wEBAPcCACGGAkAA-wIAIYgCAQD3AgAhlAIBAPcCACGeAgIAnQMAIZ8CAgCdAwAhoAIBAPcCACGiAgAAngOiAiKjAgAAlgOcAiINBwAA_QIAICYAAP0CACAnAAD9AgAgiAEAAJsDACCJAQAA_QIAIIkCAgAAAAGKAgIAAAAEiwICAAAABIwCAgAAAAGNAgIAAAABjgICAAAAAY8CAgAAAAGQAgIAoQMAIQcHAAD9AgAgJgAAoAMAICcAAKADACCJAgAAAKICAooCAAAAogIIiwIAAACiAgiQAgAAnwOiAiIHBwAA_QIAICYAAKADACAnAACgAwAgiQIAAACiAgKKAgAAAKICCIsCAAAAogIIkAIAAJ8DogIiBIkCAAAAogICigIAAACiAgiLAgAAAKICCJACAACgA6ICIg0HAAD9AgAgJgAA_QIAICcAAP0CACCIAQAAmwMAIIkBAAD9AgAgiQICAAAAAYoCAgAAAASLAgIAAAAEjAICAAAAAY0CAgAAAAGOAgIAAAABjwICAAAAAZACAgChAwAhDPwBAACiAwAw_QEAAJkCABD-AQAAogMAMP8BAQD3AgAhgAIBAPcCACGGAkAA-wIAIYcCQAD7AgAhpAICAJ0DACGlAgIAnQMAIaYCAQD4AgAhpwIBAPcCACGoAgEA9wIAIQ4KAQD4AgAh_AEAAKMDADD9AQAAgwIAEP4BAACjAwAw_wEBAPcCACGAAgEA9wIAIYECAQD3AgAhggIBAPgCACGDAgEA-AIAIYQCIAD5AgAhhQJAAPoCACGGAkAA-wIAIYcCQAD7AgAhiAIBAPcCACEPAwAAjgMAIAoBAIoDACH8AQAApAMAMP0BAAAnABD-AQAApAMAMP8BAQCJAwAhgAIBAIkDACGBAgEAiQMAIYICAQCKAwAhgwIBAIoDACGEAiAAiwMAIYUCQACMAwAhhgJAAI0DACGHAkAAjQMAIYgCAQCJAwAhBvwBAAClAwAw_QEAAOsBABD-AQAApQMAMP8BAQD3AgAhlwIBAPgCACGoAgEA9wIAIQcGAACnAwAg_AEAAKYDADD9AQAA2AEAEP4BAACmAwAw_wEBAIkDACGXAgEAigMAIagCAQCJAwAhA6kCAAAPACCqAgAADwAgqwIAAA8AIAn8AQAAqAMAMP0BAADSAQAQ_gEAAKgDADD_AQEA9wIAIYYCQAD7AgAhhwJAAPsCACGIAgEA9wIAIZQCAQD3AgAhnwICAJ0DACEJ_AEAAKkDADD9AQAAvAEAEP4BAACpAwAw_wEBAPcCACGGAkAA-wIAIYcCQAD7AgAhrAIBAPcCACGtAgEA9wIAIa4CQAD7AgAhCfwBAACqAwAw_QEAAKkBABD-AQAAqgMAMP8BAQCJAwAhhgJAAI0DACGHAkAAjQMAIawCAQCJAwAhrQIBAIkDACGuAkAAjQMAIRD8AQAAqwMAMP0BAACjAQAQ_gEAAKsDADD_AQEA9wIAIYYCQAD7AgAhhwJAAPsCACGIAgEA9wIAIa8CAQD3AgAhsAIBAPcCACGxAgEA-AIAIbICAQD4AgAhswIBAPgCACG0AkAA-gIAIbUCQAD6AgAhtgIBAPgCACG3AgEA-AIAIQv8AQAArAMAMP0BAACNAQAQ_gEAAKwDADD_AQEA9wIAIYYCQAD7AgAhhwJAAPsCACGIAgEA9wIAIa4CQAD7AgAhuAIBAPcCACG5AgEA-AIAIboCAQD4AgAhD_wBAACtAwAw_QEAAHcAEP4BAACtAwAw_wEBAPcCACGAAgEA9wIAIYECAQD3AgAhhAIgAPkCACGFAkAA-gIAIYYCQAD7AgAhhwJAAPsCACGmAgEA-AIAIbsCIAD5AgAhvAIgAPkCACG-AgAArgO-AiPAAgAArwPAAiMHBwAAgAMAICYAALMDACAnAACzAwAgiQIAAAC-AgOKAgAAAL4CCYsCAAAAvgIJkAIAALIDvgIjBwcAAIADACAmAACxAwAgJwAAsQMAIIkCAAAAwAIDigIAAADAAgmLAgAAAMACCZACAACwA8ACIwcHAACAAwAgJgAAsQMAICcAALEDACCJAgAAAMACA4oCAAAAwAIJiwIAAADAAgmQAgAAsAPAAiMEiQIAAADAAgOKAgAAAMACCYsCAAAAwAIJkAIAALEDwAIjBwcAAIADACAmAACzAwAgJwAAswMAIIkCAAAAvgIDigIAAAC-AgmLAgAAAL4CCZACAACyA74CIwSJAgAAAL4CA4oCAAAAvgIJiwIAAAC-AgmQAgAAswO-AiMXBAAAtwMAIAUAALgDACAKAAC6AwAgDwAAuQMAIBAAALsDACARAAC8AwAgEgAAvQMAIBMAAL4DACD8AQAAtAMAMP0BAABkABD-AQAAtAMAMP8BAQCJAwAhgAIBAIkDACGBAgEAiQMAIYQCIACLAwAhhQJAAIwDACGGAkAAjQMAIYcCQACNAwAhpgIBAIoDACG7AiAAiwMAIbwCIACLAwAhvgIAALUDvgIjwAIAALYDwAIjBIkCAAAAvgIDigIAAAC-AgmLAgAAAL4CCZACAACzA74CIwSJAgAAAMACA4oCAAAAwAIJiwIAAADAAgmQAgAAsQPAAiMDqQIAAAMAIKoCAAADACCrAgAAAwAgA6kCAAAHACCqAgAABwAgqwIAAAcAIAOpAgAACwAgqgIAAAsAIKsCAAALACASAwAAjgMAIA0AAMcDACD8AQAAxgMAMP0BAAAiABD-AQAAxgMAMP8BAQCJAwAhhgJAAI0DACGHAkAAjQMAIYgCAQCJAwAhwQIBAIkDACHCAgEAiQMAIcMCAQCJAwAhxAIBAIoDACHFAgEAigMAIcYCAQCKAwAhxwIBAIoDACHKAgAAIgAgywIAACIAIAOpAgAAGAAgqgIAABgAIKsCAAAYACARAwAAjgMAIAoBAIoDACH8AQAApAMAMP0BAAAnABD-AQAApAMAMP8BAQCJAwAhgAIBAIkDACGBAgEAiQMAIYICAQCKAwAhgwIBAIoDACGEAiAAiwMAIYUCQACMAwAhhgJAAI0DACGHAkAAjQMAIYgCAQCJAwAhygIAACcAIMsCAAAnACARAwAAjgMAIAoBAIoDACH8AQAAiAMAMP0BAAApABD-AQAAiAMAMP8BAQCJAwAhgAIBAIkDACGBAgEAiQMAIYICAQCKAwAhgwIBAIoDACGEAiAAiwMAIYUCQACMAwAhhgJAAI0DACGHAkAAjQMAIYgCAQCJAwAhygIAACkAIMsCAAApACAQAwAAjgMAIPwBAADAAwAw_QEAACsAEP4BAADAAwAw_wEBAIkDACGAAgEAiQMAIYECAQCJAwAhggIBAIoDACGDAgEAigMAIYQCIACLAwAhhQJAAIwDACGGAkAAjQMAIYcCQACNAwAhiAIBAIkDACHKAgAAKwAgywIAACsAIA38AQAAvwMAMP0BAABeABD-AQAAvwMAMP8BAQD3AgAhgAIBAPcCACGBAgEA9wIAIYICAQD4AgAhgwIBAPgCACGEAiAA-QIAIYUCQAD6AgAhhgJAAPsCACGHAkAA-wIAIYgCAQD3AgAhDgMAAI4DACD8AQAAwAMAMP0BAAArABD-AQAAwAMAMP8BAQCJAwAhgAIBAIkDACGBAgEAiQMAIYICAQCKAwAhgwIBAIoDACGEAiAAiwMAIYUCQACMAwAhhgJAAI0DACGHAkAAjQMAIYgCAQCJAwAhDvwBAADBAwAw_QEAAEYAEP4BAADBAwAw_wEBAPcCACGGAkAA-wIAIYcCQAD7AgAhiAIBAPcCACHBAgEA9wIAIcICAQD3AgAhwwIBAPcCACHEAgEA-AIAIcUCAQD4AgAhxgIBAPgCACHHAgEA-AIAIQ4DAACOAwAgCwAAxQMAIPwBAADCAwAw_QEAABgAEP4BAADCAwAw_wEBAIkDACGGAkAAjQMAIYcCQACNAwAhiAIBAIkDACGYAggAwwMAIZkCAQDLAwAhmgIBAIoDACGcAgAAxAOcAiKdAgEAiQMAIQiJAggAAAABigIIAAAABIsCCAAAAASMAggAAAABjQIIAAAAAY4CCAAAAAGPAggAAAABkAIIAJsDACEEiQIAAACcAgKKAgAAAJwCCIsCAAAAnAIIkAIAAJgDnAIiEQkAAMoDACAKAADQAwAgDAAA0QMAIPwBAADNAwAw_QEAABQAEP4BAADNAwAw_wEBAIkDACGGAkAAjQMAIYgCAQCJAwAhlAIBAIkDACGeAgIAzgMAIZ8CAgDOAwAhoAIBAIkDACGiAgAAzwOiAiKjAgAAxAOcAiLKAgAAFAAgywIAABQAIBADAACOAwAgDQAAxwMAIPwBAADGAwAw_QEAACIAEP4BAADGAwAw_wEBAIkDACGGAkAAjQMAIYcCQACNAwAhiAIBAIkDACHBAgEAiQMAIcICAQCJAwAhwwIBAIkDACHEAgEAigMAIcUCAQCKAwAhxgIBAIoDACHHAgEAigMAIQOpAgAAFAAgqgIAABQAIKsCAAAUACALCQAAygMAIPwBAADIAwAw_QEAABoAEP4BAADIAwAw_wEBAIkDACGGAkAAjQMAIYcCQACNAwAhiAIBAIkDACGUAgEAiQMAIZYCAADJA5YCI5cCAQCJAwAhBIkCAAAAlgIDigIAAACWAgmLAgAAAJYCCZACAACSA5YCIxIIAADTAwAgDQAAxwMAIA4AANQDACAPAAC5AwAg_AEAANIDADD9AQAADwAQ_gEAANIDADD_AQEAiQMAIYACAQCJAwAhhgJAAI0DACGHAkAAjQMAIaQCAgDOAwAhpQICAM4DACGmAgEAigMAIacCAQCJAwAhqAIBAIkDACHKAgAADwAgywIAAA8AIAiJAgEAAAABigIBAAAABIsCAQAAAASMAgEAAAABjQIBAAAAAY4CAQAAAAGPAgEAAAABkAIBAMwDACEIiQIBAAAAAYoCAQAAAASLAgEAAAAEjAIBAAAAAY0CAQAAAAGOAgEAAAABjwIBAAAAAZACAQDMAwAhDwkAAMoDACAKAADQAwAgDAAA0QMAIPwBAADNAwAw_QEAABQAEP4BAADNAwAw_wEBAIkDACGGAkAAjQMAIYgCAQCJAwAhlAIBAIkDACGeAgIAzgMAIZ8CAgDOAwAhoAIBAIkDACGiAgAAzwOiAiKjAgAAxAOcAiIIiQICAAAAAYoCAgAAAASLAgIAAAAEjAICAAAAAY0CAgAAAAGOAgIAAAABjwICAAAAAZACAgD9AgAhBIkCAAAAogICigIAAACiAgiLAgAAAKICCJACAACgA6ICIhIDAACOAwAgDQAAxwMAIPwBAADGAwAw_QEAACIAEP4BAADGAwAw_wEBAIkDACGGAkAAjQMAIYcCQACNAwAhiAIBAIkDACHBAgEAiQMAIcICAQCJAwAhwwIBAIkDACHEAgEAigMAIcUCAQCKAwAhxgIBAIoDACHHAgEAigMAIcoCAAAiACDLAgAAIgAgEAMAAI4DACALAADFAwAg_AEAAMIDADD9AQAAGAAQ_gEAAMIDADD_AQEAiQMAIYYCQACNAwAhhwJAAI0DACGIAgEAiQMAIZgCCADDAwAhmQIBAMsDACGaAgEAigMAIZwCAADEA5wCIp0CAQCJAwAhygIAABgAIMsCAAAYACAQCAAA0wMAIA0AAMcDACAOAADUAwAgDwAAuQMAIPwBAADSAwAw_QEAAA8AEP4BAADSAwAw_wEBAIkDACGAAgEAiQMAIYYCQACNAwAhhwJAAI0DACGkAgIAzgMAIaUCAgDOAwAhpgIBAIoDACGnAgEAiQMAIagCAQCJAwAhCQYAAKcDACD8AQAApgMAMP0BAADYAQAQ_gEAAKYDADD_AQEAiQMAIZcCAQCKAwAhqAIBAIkDACHKAgAA2AEAIMsCAADYAQAgA6kCAAAaACCqAgAAGgAgqwIAABoAIAKIAgEAAAABlAIBAAAAAQsDAACOAwAgCQAAygMAIPwBAADWAwAw_QEAAAsAEP4BAADWAwAw_wEBAIkDACGGAkAAjQMAIYcCQACNAwAhiAIBAIkDACGUAgEAiQMAIZ8CAgDOAwAhEQMAAI4DACD8AQAA1wMAMP0BAAAHABD-AQAA1wMAMP8BAQCJAwAhhgJAAI0DACGHAkAAjQMAIYgCAQCJAwAhrwIBAIkDACGwAgEAiQMAIbECAQCKAwAhsgIBAIoDACGzAgEAigMAIbQCQACMAwAhtQJAAIwDACG2AgEAigMAIbcCAQCKAwAhDAMAAI4DACD8AQAA2AMAMP0BAAADABD-AQAA2AMAMP8BAQCJAwAhhgJAAI0DACGHAkAAjQMAIYgCAQCJAwAhrgJAAI0DACG4AgEAiQMAIbkCAQCKAwAhugIBAIoDACEC_wEBAAAAAYgCAQAAAAEAAAAAAdICAQAAAAEB0gIBAAAAAQHSAiAAAAABAdICQAAAAAEB0gJAAAAAAQUgAACqBgAgIQAArQYAIMwCAACrBgAgzQIAAKwGACDQAgAAYQAgAyAAAKoGACDMAgAAqwYAINACAABhACAMBAAAyAUAIAUAAMkFACAKAADLBQAgDwAAygUAIBAAAMwFACARAADNBQAgEgAAzgUAIBMAAM8FACCFAgAA2gMAIKYCAADaAwAgvgIAANoDACDAAgAA2gMAIAAAAAHSAgAAAJYCAwUgAAClBgAgIQAAqAYAIMwCAACmBgAgzQIAAKcGACDQAgAAEQAgAyAAAKUGACDMAgAApgYAINACAAARACAAAAAAAAXSAggAAAAB1QIIAAAAAdYCCAAAAAHXAggAAAAB2AIIAAAAAQHSAgAAAJwCAgUgAACdBgAgIQAAowYAIMwCAACeBgAgzQIAAKIGACDQAgAAFgAgBSAAAJsGACAhAACgBgAgzAIAAJwGACDNAgAAnwYAINACAABhACADIAAAnQYAIMwCAACeBgAg0AIAABYAIAMgAACbBgAgzAIAAJwGACDQAgAAYQAgAAAAAAAF0gICAAAAAdUCAgAAAAHWAgIAAAAB1wICAAAAAdgCAgAAAAEB0gIAAACiAgIFIAAAkwYAICEAAJkGACDMAgAAlAYAIM0CAACYBgAg0AIAABEAIAUgAACRBgAgIQAAlgYAIMwCAACSBgAgzQIAAJUGACDQAgAAAQAgByAAAIEEACAhAACEBAAgzAIAAIIEACDNAgAAgwQAIM4CAAAYACDPAgAAGAAg0AIAACUAIAkDAAD2AwAg_wEBAAAAAYYCQAAAAAGHAkAAAAABiAIBAAAAAZgCCAAAAAGZAgEAAAABmgIBAAAAAZwCAAAAnAICAgAAACUAICAAAIEEACADAAAAGAAgIAAAgQQAICEAAIUEACALAAAAGAAgAwAA9AMAIBkAAIUEACD_AQEA3gMAIYYCQADiAwAhhwJAAOIDACGIAgEA3gMAIZgCCADxAwAhmQIBAN4DACGaAgEA3wMAIZwCAADyA5wCIgkDAAD0AwAg_wEBAN4DACGGAkAA4gMAIYcCQADiAwAhiAIBAN4DACGYAggA8QMAIZkCAQDeAwAhmgIBAN8DACGcAgAA8gOcAiIDIAAAkwYAIMwCAACUBgAg0AIAABEAIAMgAACRBgAgzAIAAJIGACDQAgAAAQAgAyAAAIEEACDMAgAAggQAINACAAAlACAAAAAAAAUgAACEBgAgIQAAjwYAIMwCAACFBgAgzQIAAI4GACDQAgAA1QEAIAsgAACsBAAwIQAAsQQAMMwCAACtBAAwzQIAAK4EADDOAgAAsAQAMM8CAACwBAAw0AIAALAEADDRAgAArwQAINICAACwBAAw0wIAALIEADDUAgAAswQAMAsgAACgBAAwIQAApQQAMMwCAAChBAAwzQIAAKIEADDOAgAApAQAMM8CAACkBAAw0AIAAKQEADDRAgAAowQAINICAACkBAAw0wIAAKYEADDUAgAApwQAMAsgAACSBAAwIQAAlwQAMMwCAACTBAAwzQIAAJQEADDOAgAAlgQAMM8CAACWBAAw0AIAAJYEADDRAgAAlQQAINICAACWBAAw0wIAAJgEADDUAgAAmQQAMAYDAACfBAAg_wEBAAAAAYYCQAAAAAGHAkAAAAABiAIBAAAAAZ8CAgAAAAECAAAADQAgIAAAngQAIAMAAAANACAgAACeBAAgIQAAnAQAIAEZAACNBgAwDAMAAI4DACAJAADKAwAg_AEAANYDADD9AQAACwAQ_gEAANYDADD_AQEAAAABhgJAAI0DACGHAkAAjQMAIYgCAQCJAwAhlAIBAIkDACGfAgIAzgMAIcgCAADVAwAgAgAAAA0AIBkAAJwEACACAAAAmgQAIBkAAJsEACAJ_AEAAJkEADD9AQAAmgQAEP4BAACZBAAw_wEBAIkDACGGAkAAjQMAIYcCQACNAwAhiAIBAIkDACGUAgEAiQMAIZ8CAgDOAwAhCfwBAACZBAAw_QEAAJoEABD-AQAAmQQAMP8BAQCJAwAhhgJAAI0DACGHAkAAjQMAIYgCAQCJAwAhlAIBAIkDACGfAgIAzgMAIQX_AQEA3gMAIYYCQADiAwAhhwJAAOIDACGIAgEA3gMAIZ8CAgD8AwAhBgMAAJ0EACD_AQEA3gMAIYYCQADiAwAhhwJAAOIDACGIAgEA3gMAIZ8CAgD8AwAhBSAAAIgGACAhAACLBgAgzAIAAIkGACDNAgAAigYAINACAABhACAGAwAAnwQAIP8BAQAAAAGGAkAAAAABhwJAAAAAAYgCAQAAAAGfAgIAAAABAyAAAIgGACDMAgAAiQYAINACAABhACAG_wEBAAAAAYYCQAAAAAGHAkAAAAABiAIBAAAAAZYCAAAAlgIDlwIBAAAAAQIAAAAcACAgAACrBAAgAwAAABwAICAAAKsEACAhAACqBAAgARkAAIcGADALCQAAygMAIPwBAADIAwAw_QEAABoAEP4BAADIAwAw_wEBAAAAAYYCQACNAwAhhwJAAI0DACGIAgEAiQMAIZQCAQCJAwAhlgIAAMkDlgIjlwIBAIkDACECAAAAHAAgGQAAqgQAIAIAAACoBAAgGQAAqQQAIAr8AQAApwQAMP0BAACoBAAQ_gEAAKcEADD_AQEAiQMAIYYCQACNAwAhhwJAAI0DACGIAgEAiQMAIZQCAQCJAwAhlgIAAMkDlgIjlwIBAIkDACEK_AEAAKcEADD9AQAAqAQAEP4BAACnBAAw_wEBAIkDACGGAkAAjQMAIYcCQACNAwAhiAIBAIkDACGUAgEAiQMAIZYCAADJA5YCI5cCAQCJAwAhBv8BAQDeAwAhhgJAAOIDACGHAkAA4gMAIYgCAQDeAwAhlgIAAOkDlgIjlwIBAN4DACEG_wEBAN4DACGGAkAA4gMAIYcCQADiAwAhiAIBAN4DACGWAgAA6QOWAiOXAgEA3gMAIQb_AQEAAAABhgJAAAAAAYcCQAAAAAGIAgEAAAABlgIAAACWAgOXAgEAAAABCgoAAIcEACAMAACIBAAg_wEBAAAAAYYCQAAAAAGIAgEAAAABngICAAAAAZ8CAgAAAAGgAgEAAAABogIAAACiAgKjAgAAAJwCAgIAAAAWACAgAAC3BAAgAwAAABYAICAAALcEACAhAAC2BAAgARkAAIYGADAPCQAAygMAIAoAANADACAMAADRAwAg_AEAAM0DADD9AQAAFAAQ_gEAAM0DADD_AQEAAAABhgJAAI0DACGIAgEAiQMAIZQCAQCJAwAhngICAM4DACGfAgIAzgMAIaACAQCJAwAhogIAAM8DogIiowIAAMQDnAIiAgAAABYAIBkAALYEACACAAAAtAQAIBkAALUEACAM_AEAALMEADD9AQAAtAQAEP4BAACzBAAw_wEBAIkDACGGAkAAjQMAIYgCAQCJAwAhlAIBAIkDACGeAgIAzgMAIZ8CAgDOAwAhoAIBAIkDACGiAgAAzwOiAiKjAgAAxAOcAiIM_AEAALMEADD9AQAAtAQAEP4BAACzBAAw_wEBAIkDACGGAkAAjQMAIYgCAQCJAwAhlAIBAIkDACGeAgIAzgMAIZ8CAgDOAwAhoAIBAIkDACGiAgAAzwOiAiKjAgAAxAOcAiII_wEBAN4DACGGAkAA4gMAIYgCAQDeAwAhngICAPwDACGfAgIA_AMAIaACAQDeAwAhogIAAP0DogIiowIAAPIDnAIiCgoAAP8DACAMAACABAAg_wEBAN4DACGGAkAA4gMAIYgCAQDeAwAhngICAPwDACGfAgIA_AMAIaACAQDeAwAhogIAAP0DogIiowIAAPIDnAIiCgoAAIcEACAMAACIBAAg_wEBAAAAAYYCQAAAAAGIAgEAAAABngICAAAAAZ8CAgAAAAGgAgEAAAABogIAAACiAgKjAgAAAJwCAgMgAACEBgAgzAIAAIUGACDQAgAA1QEAIAQgAACsBAAwzAIAAK0EADDQAgAAsAQAMNECAACvBAAgBCAAAKAEADDMAgAAoQQAMNACAACkBAAw0QIAAKMEACAEIAAAkgQAMMwCAACTBAAw0AIAAJYEADDRAgAAlQQAIAAAAAUgAAD_BQAgIQAAggYAIMwCAACABgAgzQIAAIEGACDQAgAAYQAgAyAAAP8FACDMAgAAgAYAINACAABhACAAAAALIAAAxQQAMCEAAMoEADDMAgAAxgQAMM0CAADHBAAwzgIAAMkEADDPAgAAyQQAMNACAADJBAAw0QIAAMgEACDSAgAAyQQAMNMCAADLBAAw1AIAAMwEADALDQAAuQQAIA4AALoEACAPAAC7BAAg_wEBAAAAAYACAQAAAAGGAkAAAAABhwJAAAAAAaQCAgAAAAGlAgIAAAABpgIBAAAAAagCAQAAAAECAAAAEQAgIAAA0AQAIAMAAAARACAgAADQBAAgIQAAzwQAIAEZAAD-BQAwEAgAANMDACANAADHAwAgDgAA1AMAIA8AALkDACD8AQAA0gMAMP0BAAAPABD-AQAA0gMAMP8BAQAAAAGAAgEAAAABhgJAAI0DACGHAkAAjQMAIaQCAgDOAwAhpQICAM4DACGmAgEAigMAIacCAQCJAwAhqAIBAIkDACECAAAAEQAgGQAAzwQAIAIAAADNBAAgGQAAzgQAIAz8AQAAzAQAMP0BAADNBAAQ_gEAAMwEADD_AQEAiQMAIYACAQCJAwAhhgJAAI0DACGHAkAAjQMAIaQCAgDOAwAhpQICAM4DACGmAgEAigMAIacCAQCJAwAhqAIBAIkDACEM_AEAAMwEADD9AQAAzQQAEP4BAADMBAAw_wEBAIkDACGAAgEAiQMAIYYCQACNAwAhhwJAAI0DACGkAgIAzgMAIaUCAgDOAwAhpgIBAIoDACGnAgEAiQMAIagCAQCJAwAhCP8BAQDeAwAhgAIBAN4DACGGAkAA4gMAIYcCQADiAwAhpAICAPwDACGlAgIA_AMAIaYCAQDfAwAhqAIBAN4DACELDQAAjwQAIA4AAJAEACAPAACRBAAg_wEBAN4DACGAAgEA3gMAIYYCQADiAwAhhwJAAOIDACGkAgIA_AMAIaUCAgD8AwAhpgIBAN8DACGoAgEA3gMAIQsNAAC5BAAgDgAAugQAIA8AALsEACD_AQEAAAABgAIBAAAAAYYCQAAAAAGHAkAAAAABpAICAAAAAaUCAgAAAAGmAgEAAAABqAIBAAAAAQQgAADFBAAwzAIAAMYEADDQAgAAyQQAMNECAADIBAAgAAAAAAAABSAAAPkFACAhAAD8BQAgzAIAAPoFACDNAgAA-wUAINACAAARACADIAAA-QUAIMwCAAD6BQAg0AIAABEAIAAAAAAAAAUgAAD0BQAgIQAA9wUAIMwCAAD1BQAgzQIAAPYFACDQAgAAYQAgAyAAAPQFACDMAgAA9QUAINACAABhACAAAAAFIAAA7wUAICEAAPIFACDMAgAA8AUAIM0CAADxBQAg0AIAAGEAIAMgAADvBQAgzAIAAPAFACDQAgAAYQAgAAAAAdICAAAAvgIDAdICAAAAwAIDCyAAALQFADAhAAC5BQAwzAIAALUFADDNAgAAtgUAMM4CAAC4BQAwzwIAALgFADDQAgAAuAUAMNECAAC3BQAg0gIAALgFADDTAgAAugUAMNQCAAC7BQAwCyAAAKgFADAhAACtBQAwzAIAAKkFADDNAgAAqgUAMM4CAACsBQAwzwIAAKwFADDQAgAArAUAMNECAACrBQAg0gIAAKwFADDTAgAArgUAMNQCAACvBQAwCyAAAJ8FADAhAACjBQAwzAIAAKAFADDNAgAAoQUAMM4CAACWBAAwzwIAAJYEADDQAgAAlgQAMNECAACiBQAg0gIAAJYEADDTAgAApAUAMNQCAACZBAAwByAAAI8FACAhAACSBQAgzAIAAJAFACDNAgAAkQUAIM4CAAAiACDPAgAAIgAg0AIAAAEAIAsgAACDBQAwIQAAiAUAMMwCAACEBQAwzQIAAIUFADDOAgAAhwUAMM8CAACHBQAw0AIAAIcFADDRAgAAhgUAINICAACHBQAw0wIAAIkFADDUAgAAigUAMAcgAAD-BAAgIQAAgQUAIMwCAAD_BAAgzQIAAIAFACDOAgAAJwAgzwIAACcAINACAADuAQAgByAAAPkEACAhAAD8BAAgzAIAAPoEACDNAgAA-wQAIM4CAAApACDPAgAAKQAg0AIAAN4CACAHIAAA9AQAICEAAPcEACDMAgAA9QQAIM0CAAD2BAAgzgIAACsAIM8CAAArACDQAgAASQAgCf8BAQAAAAGAAgEAAAABgQIBAAAAAYICAQAAAAGDAgEAAAABhAIgAAAAAYUCQAAAAAGGAkAAAAABhwJAAAAAAQIAAABJACAgAAD0BAAgAwAAACsAICAAAPQEACAhAAD4BAAgCwAAACsAIBkAAPgEACD_AQEA3gMAIYACAQDeAwAhgQIBAN4DACGCAgEA3wMAIYMCAQDfAwAhhAIgAOADACGFAkAA4QMAIYYCQADiAwAhhwJAAOIDACEJ_wEBAN4DACGAAgEA3gMAIYECAQDeAwAhggIBAN8DACGDAgEA3wMAIYQCIADgAwAhhQJAAOEDACGGAkAA4gMAIYcCQADiAwAhCgoBAAAAAf8BAQAAAAGAAgEAAAABgQIBAAAAAYICAQAAAAGDAgEAAAABhAIgAAAAAYUCQAAAAAGGAkAAAAABhwJAAAAAAQIAAADeAgAgIAAA-QQAIAMAAAApACAgAAD5BAAgIQAA_QQAIAwAAAApACAKAQDfAwAhGQAA_QQAIP8BAQDeAwAhgAIBAN4DACGBAgEA3gMAIYICAQDfAwAhgwIBAN8DACGEAiAA4AMAIYUCQADhAwAhhgJAAOIDACGHAkAA4gMAIQoKAQDfAwAh_wEBAN4DACGAAgEA3gMAIYECAQDeAwAhggIBAN8DACGDAgEA3wMAIYQCIADgAwAhhQJAAOEDACGGAkAA4gMAIYcCQADiAwAhCgoBAAAAAf8BAQAAAAGAAgEAAAABgQIBAAAAAYICAQAAAAGDAgEAAAABhAIgAAAAAYUCQAAAAAGGAkAAAAABhwJAAAAAAQIAAADuAQAgIAAA_gQAIAMAAAAnACAgAAD-BAAgIQAAggUAIAwAAAAnACAKAQDfAwAhGQAAggUAIP8BAQDeAwAhgAIBAN4DACGBAgEA3gMAIYICAQDfAwAhgwIBAN8DACGEAiAA4AMAIYUCQADhAwAhhgJAAOIDACGHAkAA4gMAIQoKAQDfAwAh_wEBAN4DACGAAgEA3gMAIYECAQDeAwAhggIBAN8DACGDAgEA3wMAIYQCIADgAwAhhQJAAOEDACGGAkAA4gMAIYcCQADiAwAhCQsAAPUDACD_AQEAAAABhgJAAAAAAYcCQAAAAAGYAggAAAABmQIBAAAAAZoCAQAAAAGcAgAAAJwCAp0CAQAAAAECAAAAJQAgIAAAjgUAIAMAAAAlACAgAACOBQAgIQAAjQUAIAEZAADuBQAwDgMAAI4DACALAADFAwAg_AEAAMIDADD9AQAAGAAQ_gEAAMIDADD_AQEAAAABhgJAAI0DACGHAkAAjQMAIYgCAQCJAwAhmAIIAMMDACGZAgEAAAABmgIBAAAAAZwCAADEA5wCIp0CAQAAAAECAAAAJQAgGQAAjQUAIAIAAACLBQAgGQAAjAUAIAz8AQAAigUAMP0BAACLBQAQ_gEAAIoFADD_AQEAiQMAIYYCQACNAwAhhwJAAI0DACGIAgEAiQMAIZgCCADDAwAhmQIBAMsDACGaAgEAigMAIZwCAADEA5wCIp0CAQCJAwAhDPwBAACKBQAw_QEAAIsFABD-AQAAigUAMP8BAQCJAwAhhgJAAI0DACGHAkAAjQMAIYgCAQCJAwAhmAIIAMMDACGZAgEAywMAIZoCAQCKAwAhnAIAAMQDnAIinQIBAIkDACEI_wEBAN4DACGGAkAA4gMAIYcCQADiAwAhmAIIAPEDACGZAgEA3gMAIZoCAQDfAwAhnAIAAPIDnAIinQIBAN4DACEJCwAA8wMAIP8BAQDeAwAhhgJAAOIDACGHAkAA4gMAIZgCCADxAwAhmQIBAN4DACGaAgEA3wMAIZwCAADyA5wCIp0CAQDeAwAhCQsAAPUDACD_AQEAAAABhgJAAAAAAYcCQAAAAAGYAggAAAABmQIBAAAAAZoCAQAAAAGcAgAAAJwCAp0CAQAAAAELDQAAngUAIP8BAQAAAAGGAkAAAAABhwJAAAAAAcECAQAAAAHCAgEAAAABwwIBAAAAAcQCAQAAAAHFAgEAAAABxgIBAAAAAccCAQAAAAECAAAAAQAgIAAAjwUAIAMAAAAiACAgAACPBQAgIQAAkwUAIA0AAAAiACANAACUBQAgGQAAkwUAIP8BAQDeAwAhhgJAAOIDACGHAkAA4gMAIcECAQDeAwAhwgIBAN4DACHDAgEA3gMAIcQCAQDfAwAhxQIBAN8DACHGAgEA3wMAIccCAQDfAwAhCw0AAJQFACD_AQEA3gMAIYYCQADiAwAhhwJAAOIDACHBAgEA3gMAIcICAQDeAwAhwwIBAN4DACHEAgEA3wMAIcUCAQDfAwAhxgIBAN8DACHHAgEA3wMAIQsgAACVBQAwIQAAmQUAMMwCAACWBQAwzQIAAJcFADDOAgAAsAQAMM8CAACwBAAw0AIAALAEADDRAgAAmAUAINICAACwBAAw0wIAAJoFADDUAgAAswQAMAoJAACGBAAgDAAAiAQAIP8BAQAAAAGGAkAAAAABiAIBAAAAAZQCAQAAAAGeAgIAAAABnwICAAAAAaICAAAAogICowIAAACcAgICAAAAFgAgIAAAnQUAIAMAAAAWACAgAACdBQAgIQAAnAUAIAEZAADtBQAwAgAAABYAIBkAAJwFACACAAAAtAQAIBkAAJsFACAI_wEBAN4DACGGAkAA4gMAIYgCAQDeAwAhlAIBAN4DACGeAgIA_AMAIZ8CAgD8AwAhogIAAP0DogIiowIAAPIDnAIiCgkAAP4DACAMAACABAAg_wEBAN4DACGGAkAA4gMAIYgCAQDeAwAhlAIBAN4DACGeAgIA_AMAIZ8CAgD8AwAhogIAAP0DogIiowIAAPIDnAIiCgkAAIYEACAMAACIBAAg_wEBAAAAAYYCQAAAAAGIAgEAAAABlAIBAAAAAZ4CAgAAAAGfAgIAAAABogIAAACiAgKjAgAAAJwCAgQgAACVBQAwzAIAAJYFADDQAgAAsAQAMNECAACYBQAgBgkAANkEACD_AQEAAAABhgJAAAAAAYcCQAAAAAGUAgEAAAABnwICAAAAAQIAAAANACAgAACnBQAgAwAAAA0AICAAAKcFACAhAACmBQAgARkAAOwFADACAAAADQAgGQAApgUAIAIAAACaBAAgGQAApQUAIAX_AQEA3gMAIYYCQADiAwAhhwJAAOIDACGUAgEA3gMAIZ8CAgD8AwAhBgkAANgEACD_AQEA3gMAIYYCQADiAwAhhwJAAOIDACGUAgEA3gMAIZ8CAgD8AwAhBgkAANkEACD_AQEAAAABhgJAAAAAAYcCQAAAAAGUAgEAAAABnwICAAAAAQz_AQEAAAABhgJAAAAAAYcCQAAAAAGvAgEAAAABsAIBAAAAAbECAQAAAAGyAgEAAAABswIBAAAAAbQCQAAAAAG1AkAAAAABtgIBAAAAAbcCAQAAAAECAAAACQAgIAAAswUAIAMAAAAJACAgAACzBQAgIQAAsgUAIAEZAADrBQAwEQMAAI4DACD8AQAA1wMAMP0BAAAHABD-AQAA1wMAMP8BAQAAAAGGAkAAjQMAIYcCQACNAwAhiAIBAIkDACGvAgEAiQMAIbACAQCJAwAhsQIBAIoDACGyAgEAigMAIbMCAQCKAwAhtAJAAIwDACG1AkAAjAMAIbYCAQCKAwAhtwIBAIoDACECAAAACQAgGQAAsgUAIAIAAACwBQAgGQAAsQUAIBD8AQAArwUAMP0BAACwBQAQ_gEAAK8FADD_AQEAiQMAIYYCQACNAwAhhwJAAI0DACGIAgEAiQMAIa8CAQCJAwAhsAIBAIkDACGxAgEAigMAIbICAQCKAwAhswIBAIoDACG0AkAAjAMAIbUCQACMAwAhtgIBAIoDACG3AgEAigMAIRD8AQAArwUAMP0BAACwBQAQ_gEAAK8FADD_AQEAiQMAIYYCQACNAwAhhwJAAI0DACGIAgEAiQMAIa8CAQCJAwAhsAIBAIkDACGxAgEAigMAIbICAQCKAwAhswIBAIoDACG0AkAAjAMAIbUCQACMAwAhtgIBAIoDACG3AgEAigMAIQz_AQEA3gMAIYYCQADiAwAhhwJAAOIDACGvAgEA3gMAIbACAQDeAwAhsQIBAN8DACGyAgEA3wMAIbMCAQDfAwAhtAJAAOEDACG1AkAA4QMAIbYCAQDfAwAhtwIBAN8DACEM_wEBAN4DACGGAkAA4gMAIYcCQADiAwAhrwIBAN4DACGwAgEA3gMAIbECAQDfAwAhsgIBAN8DACGzAgEA3wMAIbQCQADhAwAhtQJAAOEDACG2AgEA3wMAIbcCAQDfAwAhDP8BAQAAAAGGAkAAAAABhwJAAAAAAa8CAQAAAAGwAgEAAAABsQIBAAAAAbICAQAAAAGzAgEAAAABtAJAAAAAAbUCQAAAAAG2AgEAAAABtwIBAAAAAQf_AQEAAAABhgJAAAAAAYcCQAAAAAGuAkAAAAABuAIBAAAAAbkCAQAAAAG6AgEAAAABAgAAAAUAICAAAL8FACADAAAABQAgIAAAvwUAICEAAL4FACABGQAA6gUAMAwDAACOAwAg_AEAANgDADD9AQAAAwAQ_gEAANgDADD_AQEAAAABhgJAAI0DACGHAkAAjQMAIYgCAQCJAwAhrgJAAI0DACG4AgEAAAABuQIBAIoDACG6AgEAigMAIQIAAAAFACAZAAC-BQAgAgAAALwFACAZAAC9BQAgC_wBAAC7BQAw_QEAALwFABD-AQAAuwUAMP8BAQCJAwAhhgJAAI0DACGHAkAAjQMAIYgCAQCJAwAhrgJAAI0DACG4AgEAiQMAIbkCAQCKAwAhugIBAIoDACEL_AEAALsFADD9AQAAvAUAEP4BAAC7BQAw_wEBAIkDACGGAkAAjQMAIYcCQACNAwAhiAIBAIkDACGuAkAAjQMAIbgCAQCJAwAhuQIBAIoDACG6AgEAigMAIQf_AQEA3gMAIYYCQADiAwAhhwJAAOIDACGuAkAA4gMAIbgCAQDeAwAhuQIBAN8DACG6AgEA3wMAIQf_AQEA3gMAIYYCQADiAwAhhwJAAOIDACGuAkAA4gMAIbgCAQDeAwAhuQIBAN8DACG6AgEA3wMAIQf_AQEAAAABhgJAAAAAAYcCQAAAAAGuAkAAAAABuAIBAAAAAbkCAQAAAAG6AgEAAAABBCAAALQFADDMAgAAtQUAMNACAAC4BQAw0QIAALcFACAEIAAAqAUAMMwCAACpBQAw0AIAAKwFADDRAgAAqwUAIAQgAACfBQAwzAIAAKAFADDQAgAAlgQAMNECAACiBQAgAyAAAI8FACDMAgAAkAUAINACAAABACAEIAAAgwUAMMwCAACEBQAw0AIAAIcFADDRAgAAhgUAIAMgAAD-BAAgzAIAAP8EACDQAgAA7gEAIAMgAAD5BAAgzAIAAPoEACDQAgAA3gIAIAMgAAD0BAAgzAIAAPUEACDQAgAASQAgAAAABgMAAOUDACANAADaBQAgxAIAANoDACDFAgAA2gMAIMYCAADaAwAgxwIAANoDACAABQMAAOUDACAKAADaAwAgggIAANoDACCDAgAA2gMAIIUCAADaAwAgBQMAAOUDACAKAADaAwAgggIAANoDACCDAgAA2gMAIIUCAADaAwAgBAMAAOUDACCCAgAA2gMAIIMCAADaAwAghQIAANoDACAAAAAFIAAA5QUAICEAAOgFACDMAgAA5gUAIM0CAADnBQAg0AIAAGEAIAMgAADlBQAgzAIAAOYFACDQAgAAYQAgAAAABSAAAOAFACAhAADjBQAgzAIAAOEFACDNAgAA4gUAINACAABhACADIAAA4AUAIMwCAADhBQAg0AIAAGEAIAADCQAA3AUAIAoAAMsFACAMAADdBQAgBQgAAN4FACANAADaBQAgDgAA3wUAIA8AAMoFACCmAgAA2gMAIAMDAADlAwAgCwAA2wUAIJoCAADaAwAgAgYAANIEACCXAgAA2gMAIAATBAAAwAUAIAUAAMEFACAPAADCBQAgEAAAxAUAIBEAAMUFACASAADGBQAgEwAAxwUAIP8BAQAAAAGAAgEAAAABgQIBAAAAAYQCIAAAAAGFAkAAAAABhgJAAAAAAYcCQAAAAAGmAgEAAAABuwIgAAAAAbwCIAAAAAG-AgAAAL4CA8ACAAAAwAIDAgAAAGEAICAAAOAFACADAAAAZAAgIAAA4AUAICEAAOQFACAVAAAAZAAgBAAA7AQAIAUAAO0EACAPAADuBAAgEAAA8AQAIBEAAPEEACASAADyBAAgEwAA8wQAIBkAAOQFACD_AQEA3gMAIYACAQDeAwAhgQIBAN4DACGEAiAA4AMAIYUCQADhAwAhhgJAAOIDACGHAkAA4gMAIaYCAQDfAwAhuwIgAOADACG8AiAA4AMAIb4CAADqBL4CI8ACAADrBMACIxMEAADsBAAgBQAA7QQAIA8AAO4EACAQAADwBAAgEQAA8QQAIBIAAPIEACATAADzBAAg_wEBAN4DACGAAgEA3gMAIYECAQDeAwAhhAIgAOADACGFAkAA4QMAIYYCQADiAwAhhwJAAOIDACGmAgEA3wMAIbsCIADgAwAhvAIgAOADACG-AgAA6gS-AiPAAgAA6wTAAiMTBAAAwAUAIAUAAMEFACAKAADDBQAgDwAAwgUAIBAAAMQFACARAADFBQAgEgAAxgUAIP8BAQAAAAGAAgEAAAABgQIBAAAAAYQCIAAAAAGFAkAAAAABhgJAAAAAAYcCQAAAAAGmAgEAAAABuwIgAAAAAbwCIAAAAAG-AgAAAL4CA8ACAAAAwAIDAgAAAGEAICAAAOUFACADAAAAZAAgIAAA5QUAICEAAOkFACAVAAAAZAAgBAAA7AQAIAUAAO0EACAKAADvBAAgDwAA7gQAIBAAAPAEACARAADxBAAgEgAA8gQAIBkAAOkFACD_AQEA3gMAIYACAQDeAwAhgQIBAN4DACGEAiAA4AMAIYUCQADhAwAhhgJAAOIDACGHAkAA4gMAIaYCAQDfAwAhuwIgAOADACG8AiAA4AMAIb4CAADqBL4CI8ACAADrBMACIxMEAADsBAAgBQAA7QQAIAoAAO8EACAPAADuBAAgEAAA8AQAIBEAAPEEACASAADyBAAg_wEBAN4DACGAAgEA3gMAIYECAQDeAwAhhAIgAOADACGFAkAA4QMAIYYCQADiAwAhhwJAAOIDACGmAgEA3wMAIbsCIADgAwAhvAIgAOADACG-AgAA6gS-AiPAAgAA6wTAAiMH_wEBAAAAAYYCQAAAAAGHAkAAAAABrgJAAAAAAbgCAQAAAAG5AgEAAAABugIBAAAAAQz_AQEAAAABhgJAAAAAAYcCQAAAAAGvAgEAAAABsAIBAAAAAbECAQAAAAGyAgEAAAABswIBAAAAAbQCQAAAAAG1AkAAAAABtgIBAAAAAbcCAQAAAAEF_wEBAAAAAYYCQAAAAAGHAkAAAAABlAIBAAAAAZ8CAgAAAAEI_wEBAAAAAYYCQAAAAAGIAgEAAAABlAIBAAAAAZ4CAgAAAAGfAgIAAAABogIAAACiAgKjAgAAAJwCAgj_AQEAAAABhgJAAAAAAYcCQAAAAAGYAggAAAABmQIBAAAAAZoCAQAAAAGcAgAAAJwCAp0CAQAAAAETBQAAwQUAIAoAAMMFACAPAADCBQAgEAAAxAUAIBEAAMUFACASAADGBQAgEwAAxwUAIP8BAQAAAAGAAgEAAAABgQIBAAAAAYQCIAAAAAGFAkAAAAABhgJAAAAAAYcCQAAAAAGmAgEAAAABuwIgAAAAAbwCIAAAAAG-AgAAAL4CA8ACAAAAwAIDAgAAAGEAICAAAO8FACADAAAAZAAgIAAA7wUAICEAAPMFACAVAAAAZAAgBQAA7QQAIAoAAO8EACAPAADuBAAgEAAA8AQAIBEAAPEEACASAADyBAAgEwAA8wQAIBkAAPMFACD_AQEA3gMAIYACAQDeAwAhgQIBAN4DACGEAiAA4AMAIYUCQADhAwAhhgJAAOIDACGHAkAA4gMAIaYCAQDfAwAhuwIgAOADACG8AiAA4AMAIb4CAADqBL4CI8ACAADrBMACIxMFAADtBAAgCgAA7wQAIA8AAO4EACAQAADwBAAgEQAA8QQAIBIAAPIEACATAADzBAAg_wEBAN4DACGAAgEA3gMAIYECAQDeAwAhhAIgAOADACGFAkAA4QMAIYYCQADiAwAhhwJAAOIDACGmAgEA3wMAIbsCIADgAwAhvAIgAOADACG-AgAA6gS-AiPAAgAA6wTAAiMTBAAAwAUAIAoAAMMFACAPAADCBQAgEAAAxAUAIBEAAMUFACASAADGBQAgEwAAxwUAIP8BAQAAAAGAAgEAAAABgQIBAAAAAYQCIAAAAAGFAkAAAAABhgJAAAAAAYcCQAAAAAGmAgEAAAABuwIgAAAAAbwCIAAAAAG-AgAAAL4CA8ACAAAAwAIDAgAAAGEAICAAAPQFACADAAAAZAAgIAAA9AUAICEAAPgFACAVAAAAZAAgBAAA7AQAIAoAAO8EACAPAADuBAAgEAAA8AQAIBEAAPEEACASAADyBAAgEwAA8wQAIBkAAPgFACD_AQEA3gMAIYACAQDeAwAhgQIBAN4DACGEAiAA4AMAIYUCQADhAwAhhgJAAOIDACGHAkAA4gMAIaYCAQDfAwAhuwIgAOADACG8AiAA4AMAIb4CAADqBL4CI8ACAADrBMACIxMEAADsBAAgCgAA7wQAIA8AAO4EACAQAADwBAAgEQAA8QQAIBIAAPIEACATAADzBAAg_wEBAN4DACGAAgEA3gMAIYECAQDeAwAhhAIgAOADACGFAkAA4QMAIYYCQADiAwAhhwJAAOIDACGmAgEA3wMAIbsCIADgAwAhvAIgAOADACG-AgAA6gS-AiPAAgAA6wTAAiMMCAAAuAQAIA0AALkEACAOAAC6BAAg_wEBAAAAAYACAQAAAAGGAkAAAAABhwJAAAAAAaQCAgAAAAGlAgIAAAABpgIBAAAAAacCAQAAAAGoAgEAAAABAgAAABEAICAAAPkFACADAAAADwAgIAAA-QUAICEAAP0FACAOAAAADwAgCAAAjgQAIA0AAI8EACAOAACQBAAgGQAA_QUAIP8BAQDeAwAhgAIBAN4DACGGAkAA4gMAIYcCQADiAwAhpAICAPwDACGlAgIA_AMAIaYCAQDfAwAhpwIBAN4DACGoAgEA3gMAIQwIAACOBAAgDQAAjwQAIA4AAJAEACD_AQEA3gMAIYACAQDeAwAhhgJAAOIDACGHAkAA4gMAIaQCAgD8AwAhpQICAPwDACGmAgEA3wMAIacCAQDeAwAhqAIBAN4DACEI_wEBAAAAAYACAQAAAAGGAkAAAAABhwJAAAAAAaQCAgAAAAGlAgIAAAABpgIBAAAAAagCAQAAAAETBAAAwAUAIAUAAMEFACAKAADDBQAgDwAAwgUAIBAAAMQFACASAADGBQAgEwAAxwUAIP8BAQAAAAGAAgEAAAABgQIBAAAAAYQCIAAAAAGFAkAAAAABhgJAAAAAAYcCQAAAAAGmAgEAAAABuwIgAAAAAbwCIAAAAAG-AgAAAL4CA8ACAAAAwAIDAgAAAGEAICAAAP8FACADAAAAZAAgIAAA_wUAICEAAIMGACAVAAAAZAAgBAAA7AQAIAUAAO0EACAKAADvBAAgDwAA7gQAIBAAAPAEACASAADyBAAgEwAA8wQAIBkAAIMGACD_AQEA3gMAIYACAQDeAwAhgQIBAN4DACGEAiAA4AMAIYUCQADhAwAhhgJAAOIDACGHAkAA4gMAIaYCAQDfAwAhuwIgAOADACG8AiAA4AMAIb4CAADqBL4CI8ACAADrBMACIxMEAADsBAAgBQAA7QQAIAoAAO8EACAPAADuBAAgEAAA8AQAIBIAAPIEACATAADzBAAg_wEBAN4DACGAAgEA3gMAIYECAQDeAwAhhAIgAOADACGFAkAA4QMAIYYCQADiAwAhhwJAAOIDACGmAgEA3wMAIbsCIADgAwAhvAIgAOADACG-AgAA6gS-AiPAAgAA6wTAAiMD_wEBAAAAAZcCAQAAAAGoAgEAAAABAgAAANUBACAgAACEBgAgCP8BAQAAAAGGAkAAAAABiAIBAAAAAZ4CAgAAAAGfAgIAAAABoAIBAAAAAaICAAAAogICowIAAACcAgIG_wEBAAAAAYYCQAAAAAGHAkAAAAABiAIBAAAAAZYCAAAAlgIDlwIBAAAAARMEAADABQAgBQAAwQUAIAoAAMMFACAQAADEBQAgEQAAxQUAIBIAAMYFACATAADHBQAg_wEBAAAAAYACAQAAAAGBAgEAAAABhAIgAAAAAYUCQAAAAAGGAkAAAAABhwJAAAAAAaYCAQAAAAG7AiAAAAABvAIgAAAAAb4CAAAAvgIDwAIAAADAAgMCAAAAYQAgIAAAiAYAIAMAAABkACAgAACIBgAgIQAAjAYAIBUAAABkACAEAADsBAAgBQAA7QQAIAoAAO8EACAQAADwBAAgEQAA8QQAIBIAAPIEACATAADzBAAgGQAAjAYAIP8BAQDeAwAhgAIBAN4DACGBAgEA3gMAIYQCIADgAwAhhQJAAOEDACGGAkAA4gMAIYcCQADiAwAhpgIBAN8DACG7AiAA4AMAIbwCIADgAwAhvgIAAOoEvgIjwAIAAOsEwAIjEwQAAOwEACAFAADtBAAgCgAA7wQAIBAAAPAEACARAADxBAAgEgAA8gQAIBMAAPMEACD_AQEA3gMAIYACAQDeAwAhgQIBAN4DACGEAiAA4AMAIYUCQADhAwAhhgJAAOIDACGHAkAA4gMAIaYCAQDfAwAhuwIgAOADACG8AiAA4AMAIb4CAADqBL4CI8ACAADrBMACIwX_AQEAAAABhgJAAAAAAYcCQAAAAAGIAgEAAAABnwICAAAAAQMAAADYAQAgIAAAhAYAICEAAJAGACAFAAAA2AEAIBkAAJAGACD_AQEA3gMAIZcCAQDfAwAhqAIBAN4DACED_wEBAN4DACGXAgEA3wMAIagCAQDeAwAhDAMAANkFACD_AQEAAAABhgJAAAAAAYcCQAAAAAGIAgEAAAABwQIBAAAAAcICAQAAAAHDAgEAAAABxAIBAAAAAcUCAQAAAAHGAgEAAAABxwIBAAAAAQIAAAABACAgAACRBgAgDAgAALgEACAOAAC6BAAgDwAAuwQAIP8BAQAAAAGAAgEAAAABhgJAAAAAAYcCQAAAAAGkAgIAAAABpQICAAAAAaYCAQAAAAGnAgEAAAABqAIBAAAAAQIAAAARACAgAACTBgAgAwAAACIAICAAAJEGACAhAACXBgAgDgAAACIAIAMAANgFACAZAACXBgAg_wEBAN4DACGGAkAA4gMAIYcCQADiAwAhiAIBAN4DACHBAgEA3gMAIcICAQDeAwAhwwIBAN4DACHEAgEA3wMAIcUCAQDfAwAhxgIBAN8DACHHAgEA3wMAIQwDAADYBQAg_wEBAN4DACGGAkAA4gMAIYcCQADiAwAhiAIBAN4DACHBAgEA3gMAIcICAQDeAwAhwwIBAN4DACHEAgEA3wMAIcUCAQDfAwAhxgIBAN8DACHHAgEA3wMAIQMAAAAPACAgAACTBgAgIQAAmgYAIA4AAAAPACAIAACOBAAgDgAAkAQAIA8AAJEEACAZAACaBgAg_wEBAN4DACGAAgEA3gMAIYYCQADiAwAhhwJAAOIDACGkAgIA_AMAIaUCAgD8AwAhpgIBAN8DACGnAgEA3gMAIagCAQDeAwAhDAgAAI4EACAOAACQBAAgDwAAkQQAIP8BAQDeAwAhgAIBAN4DACGGAkAA4gMAIYcCQADiAwAhpAICAPwDACGlAgIA_AMAIaYCAQDfAwAhpwIBAN4DACGoAgEA3gMAIRMEAADABQAgBQAAwQUAIAoAAMMFACAPAADCBQAgEQAAxQUAIBIAAMYFACATAADHBQAg_wEBAAAAAYACAQAAAAGBAgEAAAABhAIgAAAAAYUCQAAAAAGGAkAAAAABhwJAAAAAAaYCAQAAAAG7AiAAAAABvAIgAAAAAb4CAAAAvgIDwAIAAADAAgMCAAAAYQAgIAAAmwYAIAsJAACGBAAgCgAAhwQAIP8BAQAAAAGGAkAAAAABiAIBAAAAAZQCAQAAAAGeAgIAAAABnwICAAAAAaACAQAAAAGiAgAAAKICAqMCAAAAnAICAgAAABYAICAAAJ0GACADAAAAZAAgIAAAmwYAICEAAKEGACAVAAAAZAAgBAAA7AQAIAUAAO0EACAKAADvBAAgDwAA7gQAIBEAAPEEACASAADyBAAgEwAA8wQAIBkAAKEGACD_AQEA3gMAIYACAQDeAwAhgQIBAN4DACGEAiAA4AMAIYUCQADhAwAhhgJAAOIDACGHAkAA4gMAIaYCAQDfAwAhuwIgAOADACG8AiAA4AMAIb4CAADqBL4CI8ACAADrBMACIxMEAADsBAAgBQAA7QQAIAoAAO8EACAPAADuBAAgEQAA8QQAIBIAAPIEACATAADzBAAg_wEBAN4DACGAAgEA3gMAIYECAQDeAwAhhAIgAOADACGFAkAA4QMAIYYCQADiAwAhhwJAAOIDACGmAgEA3wMAIbsCIADgAwAhvAIgAOADACG-AgAA6gS-AiPAAgAA6wTAAiMDAAAAFAAgIAAAnQYAICEAAKQGACANAAAAFAAgCQAA_gMAIAoAAP8DACAZAACkBgAg_wEBAN4DACGGAkAA4gMAIYgCAQDeAwAhlAIBAN4DACGeAgIA_AMAIZ8CAgD8AwAhoAIBAN4DACGiAgAA_QOiAiKjAgAA8gOcAiILCQAA_gMAIAoAAP8DACD_AQEA3gMAIYYCQADiAwAhiAIBAN4DACGUAgEA3gMAIZ4CAgD8AwAhnwICAPwDACGgAgEA3gMAIaICAAD9A6ICIqMCAADyA5wCIgwIAAC4BAAgDQAAuQQAIA8AALsEACD_AQEAAAABgAIBAAAAAYYCQAAAAAGHAkAAAAABpAICAAAAAaUCAgAAAAGmAgEAAAABpwIBAAAAAagCAQAAAAECAAAAEQAgIAAApQYAIAMAAAAPACAgAAClBgAgIQAAqQYAIA4AAAAPACAIAACOBAAgDQAAjwQAIA8AAJEEACAZAACpBgAg_wEBAN4DACGAAgEA3gMAIYYCQADiAwAhhwJAAOIDACGkAgIA_AMAIaUCAgD8AwAhpgIBAN8DACGnAgEA3gMAIagCAQDeAwAhDAgAAI4EACANAACPBAAgDwAAkQQAIP8BAQDeAwAhgAIBAN4DACGGAkAA4gMAIYcCQADiAwAhpAICAPwDACGlAgIA_AMAIaYCAQDfAwAhpwIBAN4DACGoAgEA3gMAIRMEAADABQAgBQAAwQUAIAoAAMMFACAPAADCBQAgEAAAxAUAIBEAAMUFACATAADHBQAg_wEBAAAAAYACAQAAAAGBAgEAAAABhAIgAAAAAYUCQAAAAAGGAkAAAAABhwJAAAAAAaYCAQAAAAG7AiAAAAABvAIgAAAAAb4CAAAAvgIDwAIAAADAAgMCAAAAYQAgIAAAqgYAIAMAAABkACAgAACqBgAgIQAArgYAIBUAAABkACAEAADsBAAgBQAA7QQAIAoAAO8EACAPAADuBAAgEAAA8AQAIBEAAPEEACATAADzBAAgGQAArgYAIP8BAQDeAwAhgAIBAN4DACGBAgEA3gMAIYQCIADgAwAhhQJAAOEDACGGAkAA4gMAIYcCQADiAwAhpgIBAN8DACG7AiAA4AMAIbwCIADgAwAhvgIAAOoEvgIjwAIAAOsEwAIjEwQAAOwEACAFAADtBAAgCgAA7wQAIA8AAO4EACAQAADwBAAgEQAA8QQAIBMAAPMEACD_AQEA3gMAIYACAQDeAwAhgQIBAN4DACGEAiAA4AMAIYUCQADhAwAhhgJAAOIDACGHAkAA4gMAIaYCAQDfAwAhuwIgAOADACG8AiAA4AMAIb4CAADqBL4CI8ACAADrBMACIwMDAAIHABENMQkJBAYDBQoEBwAQCiMBDw4FECYKESgNEioOEywPAQMAAgEDAAICAwACCQAGBQcADAgABw0XCQ4dCw8eBQIGEgYHAAgBBhMAAwkABgoAAQwZCgIDAAILAAkBCQAGAw0fAA4gAA8hAAEDAAIBAwACAQMAAgQELQAFLgAPLwAQMAABDTIAAAEDAAIBAwACAwcAFiYAFycAGAAAAAMHABYmABcnABgBAwACAQMAAgMHAB0mAB4nAB8AAAADBwAdJgAeJwAfAAADBwAkJgAlJwAmAAAAAwcAJCYAJScAJgEDAAIBAwACAwcAKyYALCcALQAAAAMHACsmACwnAC0BAwACAQMAAgMHADImADMnADQAAAADBwAyJgAzJwA0AAAAAwcAOiYAOycAPAAAAAMHADomADsnADwCAwACCQAGAgMAAgkABgUHAEEmAEQnAEWIAQBCiQEAQwAAAAAABQcAQSYARCcARYgBAEKJAQBDAAADBwBKJgBLJwBMAAAAAwcASiYASycATAEDAAIBAwACAwcAUSYAUicAUwAAAAMHAFEmAFInAFMBCAAHAQgABwUHAFgmAFsnAFyIAQBZiQEAWgAAAAAABQcAWCYAWycAXIgBAFmJAQBaAgkABgoAAQIJAAYKAAEFBwBhJgBkJwBliAEAYokBAGMAAAAAAAUHAGEmAGQnAGWIAQBiiQEAYwIDAAILAAkCAwACCwAJBQcAaiYAbScAbogBAGuJAQBsAAAAAAAFBwBqJgBtJwBuiAEAa4kBAGwBCQAGAQkABgMHAHMmAHQnAHUAAAADBwBzJgB0JwB1AQMAAgEDAAIDBwB6JgB7JwB8AAAAAwcAeiYAeycAfBQCARUzARY1ARc2ARg3ARo5ARs7Ehw8Ex0-AR5AEh9BFCJCASNDASREEihHFSlIGSpKDytLDyxNDy1ODy5PDy9RDzBTEjFUGjJWDzNYEjRZGzVaDzZbDzdcEjhfHDlgIDpiAjtjAjxmAj1nAj5oAj9qAkBsEkFtIUJvAkNxEkRyIkVzAkZ0Akd1Ekh4I0l5J0p6A0t7A0x8A019A05-A0-AAQNQggESUYMBKFKFAQNThwESVIgBKVWJAQNWigEDV4sBEliOASpZjwEuWpABBFuRAQRckgEEXZMBBF6UAQRflgEEYJgBEmGZAS9imwEEY50BEmSeATBlnwEEZqABBGehARJopAExaaUBNWqnATZrqAE2bKsBNm2sATZurQE2b68BNnCxARJxsgE3crQBNnO2ARJ0twE4dbgBNna5ATZ3ugESeL0BOXm-AT16vwEFe8ABBXzBAQV9wgEFfsMBBX_FAQWAAccBEoEByAE-ggHKAQWDAcwBEoQBzQE_hQHOAQWGAc8BBYcB0AESigHTAUCLAdQBRowB1gEHjQHXAQeOAdoBB48B2wEHkAHcAQeRAd4BB5IB4AESkwHhAUeUAeMBB5UB5QESlgHmAUiXAecBB5gB6AEHmQHpARKaAewBSZsB7QFNnAHvAQ2dAfABDZ4B8gENnwHzAQ2gAfQBDaEB9gENogH4ARKjAfkBTqQB-wENpQH9ARKmAf4BT6cB_wENqAGAAg2pAYECEqoBhAJQqwGFAlSsAYYCBq0BhwIGrgGIAgavAYkCBrABigIGsQGMAgayAY4CErMBjwJVtAGRAga1AZMCErYBlAJWtwGVAga4AZYCBrkBlwISugGaAle7AZsCXbwBnAIJvQGdAgm-AZ4CCb8BnwIJwAGgAgnBAaICCcIBpAISwwGlAl7EAacCCcUBqQISxgGqAl_HAasCCcgBrAIJyQGtAhLKAbACYMsBsQJmzAGyAgrNAbMCCs4BtAIKzwG1AgrQAbYCCtEBuAIK0gG6AhLTAbsCZ9QBvQIK1QG_AhLWAcACaNcBwQIK2AHCAgrZAcMCEtoBxgJp2wHHAm_cAcgCC90ByQIL3gHKAgvfAcsCC-ABzAIL4QHOAgviAdACEuMB0QJw5AHTAgvlAdUCEuYB1gJx5wHXAgvoAdgCC-kB2QIS6gHcAnLrAd0CduwB3wIO7QHgAg7uAeICDu8B4wIO8AHkAg7xAeYCDvIB6AIS8wHpAnf0AesCDvUB7QIS9gHuAnj3Ae8CDvgB8AIO-QHxAhL6AfQCefsB9QJ9"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer } = await import("buffer");
  const wasmArray = Buffer.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// src/generated/internal/prismaNamespace.ts
import * as runtime2 from "@prisma/client/runtime/client";
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/enums.ts
var UserStatus = {
  ACTIVE: "ACTIVE",
  DELETED: "DELETED",
  BLOCKED: "BLOCKED"
};
var OrderStatus = {
  PENDING: "PENDING",
  CONFIRMED: "CONFIRMED",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED"
};
var Role = {
  CUSTOMER: "CUSTOMER",
  SELLER: "SELLER",
  ADMIN: "ADMIN"
};
var PaymentStatus = {
  PAID: "PAID",
  UNPAID: "UNPAID",
  CANCELLED: "CANCELLED"
};

// src/generated/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/config/env.ts
import dotenv from "dotenv";
dotenv.config();
var loadEnvVariables = () => {
  const requiredEnvVariable = [
    "NODE_ENV",
    "PORT",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
    "APP_URL",
    "APP_USER",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "ADMIN_EMAIL",
    "FRONTEND_URL",
    "ADMIN_PASSWORD",
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "ACCESS_TOKEN_EXPIRES_IN",
    "REFRESH_TOKEN_EXPIRES_IN",
    "BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN",
    "EMAIL_SENDER_SMTP_USER",
    "EMAIL_SENDER_SMTP_PASS",
    "EMAIL_SENDER_SMTP_HOST",
    "EMAIL_SENDER_SMTP_PORT",
    "EMAIL_SENDER_SMTP_FROM",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET"
  ];
  requiredEnvVariable.forEach((variable) => {
    if (!process.env[variable]) {
      throw new Error(`Environment variable ${variable} is required but not set in .env file.`);
    }
  });
  return {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    APP_URL: process.env.APP_URL,
    APP_USER: process.env.APP_USER,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES_IN: process.env.ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
    BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN: process.env.BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN,
    EMAIL_SENDER: {
      SMTP_USER: process.env.EMAIL_SENDER_SMTP_USER,
      SMTP_PASS: process.env.EMAIL_SENDER_SMTP_PASS,
      SMTP_HOST: process.env.EMAIL_SENDER_SMTP_HOST,
      SMTP_PORT: process.env.EMAIL_SENDER_SMTP_PORT,
      SMTP_FROM: process.env.EMAIL_SENDER_SMTP_FROM
    },
    CLOUDINARY: {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
    }
  };
};
var envVars = loadEnvVariables();

// src/lib/prisma.ts
var connectionString = envVars.DATABASE_URL;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/module/medicine/medicine.service.ts
var getMedicineById = async (id) => {
  const result = await prisma.medicine.findUniqueOrThrow({
    where: {
      id
    },
    include: {
      reviews: true
    }
  });
  return result;
};
var getAllMedicine = async ({ search, price, category, page, limit, sortBy, sortOrder }) => {
  const skip = (page - 1) * limit;
  const priceNum = Number(price);
  const andConditions = [];
  if (search) {
    andConditions.push({
      name: {
        contains: search,
        mode: "insensitive"
      }
    });
  }
  if (priceNum) {
    andConditions.push({
      price: { lte: priceNum }
    });
  }
  if (category) {
    andConditions.push({
      categoryName: category
    });
  }
  const result = await prisma.medicine.findMany({
    take: limit,
    skip,
    where: {
      AND: andConditions
    },
    orderBy: sortBy && sortOrder ? {
      [sortBy]: sortOrder
    } : { price: "asc" },
    include: {
      orders: true,
      reviews: true
    }
  });
  const total = await prisma.medicine.count({
    // take : limit,
    // skip,
    where: {
      AND: andConditions
    }
  });
  return {
    data: result,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var medicineService = {
  getMedicineById,
  getAllMedicine
};

// src/shared/catchAsync.ts
var catchAsync = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

// src/shared/sendResponse.ts
var sendResponse = (res, responseData) => {
  const { httpStatusCode, success, message, data, meta } = responseData;
  res.status(httpStatusCode).json({
    success,
    message,
    data,
    meta
  });
};

// src/module/medicine/medicine.controller.ts
import status from "http-status";
var getMedicineById2 = catchAsync(
  async (req, res) => {
    const result = await medicineService.getMedicineById(req.params.id);
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Medicine fetched successfully",
      data: result
    });
  }
);
var getAllMedicine2 = catchAsync(
  async (req, res) => {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : void 0;
    const { sortBetweenPrice } = req.query;
    const { price } = req.query;
    const priceString = typeof price === "string" ? price : void 0;
    const { category } = req.query;
    const categoryString = typeof category === "string" ? category : void 0;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 8;
    const sortBy = req.query.sortBy ?? "price";
    const sortOrder = req.query.sortBetweenPrice ?? "asc";
    const result = await medicineService.getAllMedicine({ search: searchString, price: priceString, category: categoryString, page, limit, sortBy, sortOrder });
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Medicine fetched successfully",
      data: result
    });
  }
);
var medicineController = {
  getMedicineById: getMedicineById2,
  getAllMedicine: getAllMedicine2
};

// src/module/medicine/medicine.route.ts
var router = express.Router();
router.get("/", medicineController.getAllMedicine);
router.get("/:id", medicineController.getMedicineById);
var medicineRouter = router;

// src/module/category/category.route.ts
import express2 from "express";

// src/module/category/category.service.ts
var createCategory = async (data) => {
  const result = await prisma.category.create({
    data
  });
  return result;
};
var getSingleCategory = async (categoryName) => {
  const result = await prisma.category.findUnique({
    where: {
      categoryName
    },
    include: {
      medicines: {
        select: {
          name: true,
          price: true
        }
      }
    }
  });
  return result;
};
var getAllCategory = async () => {
  const result = await prisma.category.findMany();
  return result;
};
var categoryService = {
  createCategory,
  getSingleCategory,
  getAllCategory
};

// src/module/category/category.controller.ts
import status2 from "http-status";
var createCategory2 = catchAsync(
  async (req, res) => {
    const result = await categoryService.createCategory(req.body);
    sendResponse(res, {
      httpStatusCode: status2.OK,
      success: true,
      message: "Category created successfully",
      data: result
    });
  }
);
var getCategory = catchAsync(
  async (req, res) => {
    const { categoryName } = req.params;
    const result = await categoryService.getSingleCategory(categoryName);
    sendResponse(res, {
      httpStatusCode: status2.OK,
      success: true,
      message: "Category fetched successfully",
      data: result
    });
  }
);
var getAllCategory2 = catchAsync(
  async (req, res) => {
    const result = await categoryService.getAllCategory();
    sendResponse(res, {
      httpStatusCode: status2.OK,
      success: true,
      message: "Categories fetched successfully",
      data: result
    });
  }
);
var categoryController = {
  createCategory: createCategory2,
  getCategory,
  getAllCategory: getAllCategory2
};

// src/middlewares/auth.ts
import status3 from "http-status";

// src/utils/cookie.ts
var setCookie = (res, key, value, options) => {
  res.cookie(key, value, options);
};
var getCookie = (req, key) => {
  return req.cookies[key];
};
var clearCookie = (res, key, options) => {
  res.clearCookie(key, options);
};
var CookieUtils = {
  setCookie,
  getCookie,
  clearCookie
};

// src/utils/jwt.ts
import jwt from "jsonwebtoken";
var createToken = (payload, secret, { expiresIn }) => {
  const options = {};
  if (expiresIn) options.expiresIn = expiresIn;
  const token = jwt.sign(payload, secret, options);
  return token;
};
var verifyToken = (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    return {
      success: true,
      data: decoded
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
      error
    };
  }
};
var decodedToken = (token) => {
  const decoded = jwt.decode(token);
  return decoded;
};
var jwtUtils = {
  createToken,
  verifyToken,
  decodedToken
};

// src/errorHelper/AppError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};
var AppError_default = AppError;

// src/middlewares/auth.ts
var auth = (...authRoles) => async (req, res, next) => {
  try {
    const sessionToken = CookieUtils.getCookie(req, "better-auth.session_token") || CookieUtils.getCookie(req, "__Secure-better-auth.session_token");
    if (!sessionToken) {
      throw new AppError_default(status3.UNAUTHORIZED, "Unauthorized access! No session token provided.");
    }
    console.log("session token is => ", sessionToken);
    const parsedSessionToken = sessionToken.split(".")[0] ?? "";
    const sessionExists = await prisma.session.findFirst({
      where: {
        token: parsedSessionToken
      },
      include: {
        user: true
      }
    });
    console.log("Session is => ", sessionExists);
    if (!sessionExists) {
      throw new AppError_default(status3.UNAUTHORIZED, "Unauthorized access! Session has expired or is invalid.");
    }
    const accessToken = CookieUtils.getCookie(req, "accessToken");
    if (!accessToken) {
      throw new AppError_default(status3.UNAUTHORIZED, "Unauthorized access! No access token provided.");
    }
    const verifiedToken = jwtUtils.verifyToken(accessToken, envVars.ACCESS_TOKEN_SECRET);
    if (!verifiedToken.success) {
      throw new AppError_default(status3.UNAUTHORIZED, "Unauthorized access! Invalid access token.");
    }
    req.user = {
      id: verifiedToken.data?.userId,
      role: verifiedToken.data?.role,
      email: verifiedToken.data?.email
    };
    if (authRoles.length > 0 && !authRoles.includes(verifiedToken.data.role)) {
      throw new AppError_default(status3.FORBIDDEN, "Forbidden access! You do not have permission to access this resource.");
    }
    next();
  } catch (error) {
    next(error);
  }
};

// src/middlewares/validateRequest.ts
var validateRequest = (zodSchema) => {
  return (req, res, next) => {
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }
    const parseResult = zodSchema.safeParse(req.body);
    if (!parseResult.success) {
      next(parseResult.error);
    }
    req.body = parseResult.data;
    next();
  };
};

// src/module/category/category.validation.ts
import z from "zod";
var createCategoryZodSchema = z.object({
  categoryName: z.string().min(1, "Category name is required").max(30, "Category name must be less than 30 characters"),
  description: z.string().optional()
});

// src/module/category/category.route.ts
var router2 = express2.Router();
router2.get("/", categoryController.getAllCategory);
router2.get("/:categoryName", categoryController.getCategory);
router2.post("/", auth(Role.SELLER, Role.ADMIN), validateRequest(createCategoryZodSchema), categoryController.createCategory);
var categoryRoute = router2;

// src/app.ts
import cors from "cors";

// src/module/seller/seller.route.ts
import express3 from "express";

// src/module/seller/seller.service.ts
var createMedicine = async (payload) => {
  console.log(payload);
  const category = await prisma.category.findUniqueOrThrow({
    where: {
      categoryName: payload.categoryName
    }
  });
  console.log(category);
  const result = await prisma.medicine.create({
    data: {
      ...payload,
      categoryId: category.id
    }
  });
  console.log("result is => ", result);
  return result;
};
var updateMedicine = async (payload, id) => {
  await prisma.medicine.findUniqueOrThrow({
    where: {
      id
    }
  });
  const result = await prisma.medicine.update({
    where: {
      id
    },
    data: {
      name: payload.name,
      price: payload.price,
      stock: payload.stock
    }
  });
  return result;
};
var deleteMedicine = async (id) => {
  await prisma.medicine.findUniqueOrThrow({
    where: {
      id
    }
  });
  try {
    const result = await prisma.medicine.delete({
      where: {
        id
      }
    });
    return result;
  } catch (error) {
    throw new Error("Medicine is not Exists!");
  }
};
var getAllOrder = async () => {
  const result = await prisma.order.findMany();
  return result;
};
var updateStatus = async (payload, id) => {
  console.log(id);
  console.log(payload);
  await prisma.order.findUniqueOrThrow({
    where: {
      id
    }
  });
  const result = await prisma.order.update({
    where: {
      id
    },
    data: payload
  });
  console.log(result);
  return result;
};
var sellerServices = {
  createMedicine,
  updateMedicine,
  deleteMedicine,
  getAllOrder,
  updateStatus
};

// src/module/seller/seller.controller.ts
import status4 from "http-status";
var createMedicine2 = catchAsync(async (req, res) => {
  if (req.body.data) {
    req.body = JSON.parse(req.body.data);
  }
  const name = req.body.name;
  const categoryName = req.body.categoryName;
  const price = Number(req.body.price);
  const stock = Number(req.body.stock);
  const payload = {
    name,
    categoryName,
    price,
    stock,
    image: req.file?.path || null
  };
  console.log(payload);
  const result = await sellerServices.createMedicine(payload);
  sendResponse(res, {
    httpStatusCode: status4.OK,
    success: true,
    message: "Medicine created successfully",
    data: result
  });
});
var updateMedicine2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await sellerServices.updateMedicine(req.body, id);
  sendResponse(res, {
    httpStatusCode: status4.OK,
    success: true,
    message: "Medicine updated successfully",
    data: result
  });
});
var deleteMedicine2 = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await sellerServices.deleteMedicine(id);
  sendResponse(res, {
    httpStatusCode: status4.OK,
    success: true,
    message: "Medicine deleted successfully",
    data: result
  });
});
var getAllOrder2 = catchAsync(async (req, res) => {
  const result = await sellerServices.getAllOrder();
  sendResponse(res, {
    httpStatusCode: status4.OK,
    success: true,
    message: "All orders fetched successfully",
    data: result
  });
});
var updateStatus2 = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await sellerServices.updateStatus(req.body, id);
  sendResponse(res, {
    httpStatusCode: status4.OK,
    success: true,
    message: "Order status updated successfully",
    data: result
  });
});
var sellerController = {
  createMedicine: createMedicine2,
  updateMedicine: updateMedicine2,
  deleteMedicine: deleteMedicine2,
  getAllOrder: getAllOrder2,
  updateStatus: updateStatus2
};

// src/config/multer.config.ts
import { CloudinaryStorage } from "multer-storage-cloudinary";

// src/config/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";
import status5 from "http-status";
cloudinary.config({
  cloud_name: envVars.CLOUDINARY.CLOUDINARY_CLOUD_NAME,
  api_key: envVars.CLOUDINARY.CLOUDINARY_API_KEY,
  api_secret: envVars.CLOUDINARY.CLOUDINARY_API_SECRET
});
var deleteFileFromCloudinary = async (url) => {
  try {
    const regex = /\/v\d+\/(.+?)(?:\.[a-zA-Z0-9]+)+$/;
    const match = url.match(regex);
    if (match && match[1]) {
      const publicId = match[1];
      await cloudinary.uploader.destroy(
        publicId,
        {
          resource_type: "image"
        }
      );
    }
  } catch (error) {
    console.error("Error deleting file from Cloudinary", error);
    throw new AppError_default(status5.INTERNAL_SERVER_ERROR, "Failed to delete file from Cloudinary");
  }
};
var cloudinaryUpload = cloudinary;

// src/config/multer.config.ts
import multer from "multer";
var storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: async (req, file) => {
    console.log("file", file);
    const originalName = file.originalname;
    const extension = originalName.split(".").pop()?.toLocaleLowerCase();
    const fileNameWithoutExtension = originalName.split(".").slice(0, -1).join(".").toLocaleLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9\-]/g, "");
    const uniqueName = Math.random().toString(36).substring(2) + "-" + Date.now() + "-" + fileNameWithoutExtension;
    const folder = extension === "pdf" ? "pdfs" : "images";
    return {
      folder: `MediStore/${folder}`,
      public_id: uniqueName,
      resource_type: "auto"
    };
  }
});
var multerUpload = multer({ storage });

// src/module/seller/seller.route.ts
var router3 = express3.Router();
router3.post("/medicines", auth(Role.SELLER, Role.ADMIN), multerUpload.single("file"), sellerController.createMedicine);
router3.put("/medicines/:id", auth(Role.SELLER, Role.ADMIN), sellerController.updateMedicine);
router3.delete("/medicines/:id", auth(Role.SELLER, Role.ADMIN), sellerController.deleteMedicine);
router3.get("/orders", auth(Role.SELLER, Role.ADMIN), sellerController.getAllOrder);
router3.patch("/orders/:id", auth(Role.SELLER, Role.ADMIN), sellerController.updateStatus);
var sellerRouter = router3;

// src/module/orders/orders.route.ts
import express4 from "express";

// src/config/stripe.config.ts
import Stripe from "stripe";
var stripe = new Stripe(envVars.STRIPE_SECRET_KEY);

// src/module/orders/orders.service.ts
import { v7 as uuidv7 } from "uuid";
var createOrder = async (payload, userId) => {
  const medicineExists = await prisma.medicine.findUnique({
    where: {
      id: payload.medicineId
    }
  });
  if (!medicineExists) {
    throw new Error("Medicine is not Found! Try again later");
  }
  if (medicineExists?.stock < payload.quantity) {
    throw new Error("Insufficient medicine stock!");
  }
  const medicine = await prisma.medicine.update({
    where: {
      id: payload.medicineId
    },
    data: {
      stock: {
        decrement: payload.quantity
      }
    }
  });
  const result = await prisma.$transaction(async (tx) => {
    const transactionId = String(uuidv7());
    const orderData = await prisma.order.create({
      data: {
        userId,
        medicineId: payload.medicineId,
        orderStatus: OrderStatus.PENDING,
        quantity: payload.quantity,
        totalAmount: (medicine?.price ?? 0) * payload.quantity,
        addressId: payload.addressId
      }
    });
    const paymentData = await tx.payment.create({
      data: {
        amount: (medicine?.price ?? 0) * payload.quantity,
        transactionId,
        orderId: orderData.id,
        userId
      }
    });
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {
              name: `Payment for Medicine ${medicine?.name}`
            },
            unit_amount: Math.round((medicine?.price ?? 0) * payload.quantity * 100)
            // amount in cents
          },
          quantity: 1
        }
      ],
      metadata: {
        orderId: orderData.id,
        paymentId: paymentData.id
      },
      success_url: `${envVars.FRONTEND_URL}/customer/cart?success=true`,
      cancel_url: `${envVars.FRONTEND_URL}/customer/cart?success=false`
    });
    return {
      orderData,
      paymentData,
      paymentUrl: session.url
    };
  });
  return {
    order: result.orderData,
    payment: result.paymentData,
    paymentUrl: result.paymentUrl
  };
};
var getAllOrder3 = async (id, page, limit) => {
  const data = await prisma.order.findMany({
    take: limit,
    skip: (page - 1) * limit,
    where: {
      userId: id
    }
  });
  const total = await prisma.order.count({
    where: {
      userId: id
    }
  });
  return { data, total, page, limit, totalPage: Math.ceil(total / limit) };
};
var getSingleOrder = async (id) => {
  const result = await prisma.order.findMany({
    where: {
      id
    }
  });
  return result;
};
var deleteOrder = async (id, userId) => {
  const result = await prisma.order.delete({
    where: {
      id,
      userId
    }
  });
  return result;
};
var orderService = {
  createOrder,
  getAllOrder: getAllOrder3,
  getSingleOrder,
  deleteOrder
};

// src/module/orders/orders.controller.ts
import status6 from "http-status";
var createOrder2 = catchAsync(
  async (req, res) => {
    const result = await orderService.createOrder(req.body, req.user?.id);
    console.log("result after order", result);
    sendResponse(res, {
      httpStatusCode: status6.CREATED,
      success: true,
      message: "Order created successfully",
      data: result
    });
  }
);
var getAllOrder4 = catchAsync(
  async (req, res) => {
    const id = req.user?.id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const result = await orderService.getAllOrder(id, page, limit);
    sendResponse(res, {
      httpStatusCode: status6.OK,
      success: true,
      message: "Orders fetched successfully",
      data: result
    });
  }
);
var getSingleOrder2 = catchAsync(
  async (req, res) => {
    const id = req.params.id;
    const result = await orderService.getSingleOrder(id);
    sendResponse(res, {
      httpStatusCode: status6.OK,
      success: true,
      message: "Order fetched successfully",
      data: result
    });
  }
);
var deleteOrder2 = catchAsync(
  async (req, res) => {
    const id = req.params.id;
    const userId = req.user?.id;
    const result = await orderService.deleteOrder(id, userId);
    sendResponse(res, {
      httpStatusCode: status6.OK,
      success: true,
      message: "Order deleted successfully",
      data: result
    });
  }
);
var orderController = {
  createOrder: createOrder2,
  getAllOrder: getAllOrder4,
  getSingleOrder: getSingleOrder2,
  deleteOrder: deleteOrder2
};

// src/module/orders/order.validation.ts
import { z as z2 } from "zod";
var createOrderZodSchema = z2.object({
  medicineId: z2.string("You have to provide medecineId"),
  quantity: z2.number().min(1, "Quantity must be a positive number"),
  addressId: z2.string("You must provide addressId")
});

// src/module/orders/orders.route.ts
var route = express4.Router();
route.post("/", validateRequest(createOrderZodSchema), auth(Role.CUSTOMER), orderController.createOrder);
route.get("/", auth(Role.CUSTOMER, Role.SELLER, Role.ADMIN), orderController.getAllOrder);
route.get("/:id", auth(Role.CUSTOMER, Role.SELLER, Role.ADMIN), orderController.getSingleOrder);
route.delete("/:id", auth(Role.CUSTOMER, Role.SELLER, Role.ADMIN), orderController.deleteOrder);
var orderRoute = route;

// src/module/admin/admin.route.ts
import express5 from "express";

// src/module/admin/admin.service.ts
var getAllUser = async (page, limit) => {
  const data = await prisma.user.findMany({
    take: limit,
    skip: (page - 1) * limit
  });
  const totalUser = await prisma.user.count();
  return { data, page, limit, totalUser, totalPage: Math.ceil(totalUser / limit) };
};
var updateUserStatus = async (payload, id) => {
  console.log(payload);
  await prisma.user.findUniqueOrThrow({
    where: {
      id
    }
  });
  const result = await prisma.user.update({
    where: {
      id
    },
    data: {
      userStatus: payload.userStatus,
      emailVerified: payload.emailVerified
    }
  });
  return result;
};
var getStats = async () => {
  return await prisma.$transaction(async (tx) => {
    const [totalUser, totalCustomer, totalSeller, totalOrder, totalOrderAmount, totalMedicine, totalCategory] = await Promise.all([
      await prisma.user.count(),
      await prisma.user.count({ where: { role: Role.CUSTOMER } }),
      await prisma.user.count({ where: { role: Role.SELLER } }),
      await prisma.order.count(),
      await prisma.order.aggregate({ _sum: { totalAmount: true } }),
      await prisma.medicine.count(),
      await prisma.category.count()
    ]);
    return {
      totalUser,
      totalCustomer,
      totalSeller,
      totalOrder,
      totalOrderAmount: totalOrderAmount._sum.totalAmount,
      totalMedicine,
      totalCategory
    };
  });
};
var adminService = {
  getAllUser,
  updateUserStatus,
  getStats
};

// src/module/admin/admin.controller.ts
var getAllUser2 = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const result = await adminService.getAllUser(page, limit);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var updateUserStatus2 = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await adminService.updateUserStatus(req.body, id);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var getStats2 = async (req, res) => {
  try {
    const result = await adminService.getStats();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
var adminController = {
  getAllUser: getAllUser2,
  updateUserStatus: updateUserStatus2,
  getStats: getStats2
};

// src/module/admin/admin.route.ts
var router4 = express5.Router();
router4.get("/users", auth(Role.ADMIN), adminController.getAllUser);
router4.get("/stats", auth(Role.ADMIN, Role.SELLER), adminController.getStats);
router4.patch("/users/:id", auth(Role.ADMIN), adminController.updateUserStatus);
var adminRoute = router4;

// src/module/customer/customer.route.ts
import express6 from "express";

// src/module/customer/customer.service.ts
var getMyProfile = async (id) => {
  const res = await prisma.user.findUniqueOrThrow({
    where: {
      id
    },
    select: {
      id: true,
      role: true,
      name: true,
      email: true,
      image: true
    }
  });
  const addressInfo = await prisma.address.findUnique({
    where: {
      userId: res.id
    },
    select: {
      fullName: true,
      phone: true,
      city: true,
      area: true,
      street: true,
      houseNo: true,
      postalCode: true
    }
  });
  return {
    user: res,
    address: addressInfo
  };
};
var getMyOrder = async (id) => {
  const res = await prisma.order.findMany({
    where: {
      userId: id
    },
    include: {
      medicine: {
        select: {
          name: true,
          price: true,
          categoryName: true,
          image: true
        }
      }
    }
  });
  return res;
};
var editMyProfile = async (payload, userId) => {
  const res = await prisma.user.update({
    where: {
      id: userId
    },
    data: {
      name: payload.name,
      email: payload.email
    }
  });
  return res;
};
var getSingleOrder3 = async (id) => {
  const res = await prisma.order.findUniqueOrThrow({
    where: {
      id
    }
  });
  return res;
};
var addShippingAddress = async (payload, userId) => {
  const user = await prisma.address.update({
    where: {
      userId
    },
    data: {
      city: payload.city
    }
  });
  console.log(user);
  return user;
};
var AddItemToCard = async (payload, userId) => {
  const res = await prisma.cart.upsert({
    where: {
      userId_medicineId: {
        userId,
        medicineId: payload.medicineId
      }
    },
    update: {
      quantity: {
        increment: 1
      }
    },
    create: {
      userId,
      medicineId: payload.medicineId
    }
  });
  return res;
};
var getMyCartItem = async (userId) => {
  const cartItem = await prisma.cart.findMany({
    where: {
      userId
    }
  });
  return cartItem;
};
var getMySingleCartItem = async (id) => {
  const cartItem = await prisma.cart.findUnique({
    where: {
      id
    }
  });
  return cartItem;
};
var DecrementCartItem = async (payload, userId) => {
  const checkItem = await prisma.cart.findUnique({
    where: {
      userId_medicineId: {
        userId,
        medicineId: payload.medicineId
      }
    }
  });
  if (checkItem?.quantity === 1 || checkItem?.quantity === null) {
    throw new Error("Quantity Cannot be Negative");
  }
  const res = await prisma.cart.upsert({
    where: {
      userId_medicineId: {
        userId,
        medicineId: payload.medicineId
      }
    },
    update: {
      quantity: {
        decrement: 1
      }
    },
    create: {
      userId,
      medicineId: payload.medicineId
    }
  });
  console.log(res);
  return res;
};
var deleteCartItem = async (id) => {
  const res = await prisma.cart.delete({
    where: {
      id
    }
  });
  return res;
};
var createAddress = async (payload, userId) => {
  const res = await prisma.address.create({
    data: {
      ...payload,
      userId
    }
  });
  return res;
};
var updateAddress = async (payload, userId) => {
  const updateAddress3 = await prisma.address.upsert({
    where: {
      userId
    },
    update: {
      ...payload
    },
    create: {
      ...payload,
      userId
    }
  });
  console.log(updateAddress3);
  return updateAddress3;
};
var getMyAddress = async (userId) => {
  const res = await prisma.address.findUniqueOrThrow({
    where: {
      userId
    }
  });
  return res;
};
var createReview = async (payload, userId) => {
  console.log("payload ", payload);
  console.log(userId);
  await prisma.user.findUniqueOrThrow({
    where: {
      id: userId
    }
  });
  const res = await prisma.review.create({
    data: {
      ...payload,
      userId
    }
  });
  console.log("res ", res);
  return res;
};
var getReview = async (userId) => {
  const res = await prisma.review.findMany({
    where: {
      userId
    }
  });
  return res;
};
var getSingleMedicineReview = async (medicineId) => {
  const res = await prisma.review.findMany({
    where: {
      medicineId
    }
  });
  return res;
};
var customerService = {
  getMyProfile,
  getMyOrder,
  editMyProfile,
  getSingleOrder: getSingleOrder3,
  addShippingAddress,
  AddItemToCard,
  getMyCartItem,
  getMySingleCartItem,
  DecrementCartItem,
  deleteCartItem,
  createAddress,
  updateAddress,
  getMyAddress,
  createReview,
  getReview,
  getSingleMedicineReview
};

// src/module/customer/customer.controller.ts
import status7 from "http-status";
var getMyProfile2 = catchAsync(
  async (req, res) => {
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "You are not Authorized"
      });
    }
    const { id } = req.user;
    console.log("From customer controller ", req.user);
    console.log(id);
    const result = await customerService.getMyProfile(id);
    console.log("My prof", result);
    sendResponse(res, {
      httpStatusCode: status7.OK,
      success: true,
      message: "Profile fetched successfully",
      data: result
    });
  }
);
var getMyOrder2 = catchAsync(
  async (req, res) => {
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "You are not Authorized"
      });
    }
    const { id } = req.user;
    const result = await customerService.getMyOrder(id);
    console.log(result);
    sendResponse(res, {
      httpStatusCode: status7.OK,
      success: true,
      message: "Orders fetched successfully",
      data: result
    });
  }
);
var editMyProfile2 = catchAsync(
  async (req, res) => {
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "You are not Authorized"
      });
    }
    const { id } = req.user;
    const result = await customerService.editMyProfile(req.body, id);
    sendResponse(res, {
      httpStatusCode: status7.OK,
      success: true,
      message: "Profile updated successfully",
      data: result
    });
  }
);
var getSingleOrder4 = catchAsync(
  async (req, res) => {
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "You are not Authorized"
      });
    }
    const { id } = req.params;
    const result = await customerService.getSingleOrder(id);
    sendResponse(res, {
      httpStatusCode: status7.OK,
      success: true,
      message: "Order fetched successfully",
      data: result
    });
  }
);
var addShippingAddress2 = catchAsync(
  async (req, res) => {
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "You are not Authorized"
      });
    }
    const { id } = req.user;
    const result = await customerService.addShippingAddress(req.body, id);
    sendResponse(res, {
      httpStatusCode: status7.OK,
      success: true,
      message: "Shipping address added successfully",
      data: result
    });
  }
);
var AddItemToCard2 = catchAsync(
  async (req, res) => {
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "You are not Authorized"
      });
    }
    const { id } = req.user;
    const result = await customerService.AddItemToCard(req.body, id);
    console.log(result);
    sendResponse(res, {
      httpStatusCode: status7.OK,
      success: true,
      message: "Item added to cart successfully",
      data: result
    });
  }
);
var DecrementCartItem2 = catchAsync(
  async (req, res) => {
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "You are not Authorized"
      });
    }
    const { id } = req.user;
    const result = await customerService.DecrementCartItem(req.body, id);
    sendResponse(res, {
      httpStatusCode: status7.OK,
      success: true,
      message: "Cart item decremented successfully",
      data: result
    });
  }
);
var getMyCartItem2 = catchAsync(
  async (req, res) => {
    console.log(req.user);
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "You are not Authorized"
      });
    }
    const userId = req.user.id;
    const result = await customerService.getMyCartItem(userId);
    console.log(result);
    sendResponse(res, {
      httpStatusCode: status7.OK,
      success: true,
      message: "Cart items fetched successfully",
      data: result
    });
  }
);
var getMySingleCartItem2 = catchAsync(
  async (req, res) => {
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "You are not Authorized"
      });
    }
    const { id } = req.params;
    const result = await customerService.getMySingleCartItem(id);
    sendResponse(res, {
      httpStatusCode: status7.OK,
      success: true,
      message: "Cart item fetched successfully",
      data: result
    });
  }
);
var deleteCartItem2 = catchAsync(
  async (req, res) => {
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "You are not Authorized"
      });
    }
    const { id } = req.params;
    const result = await customerService.deleteCartItem(id);
    sendResponse(res, {
      httpStatusCode: status7.OK,
      success: true,
      message: "Cart item deleted successfully",
      data: result
    });
  }
);
var createAddress2 = catchAsync(
  async (req, res) => {
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "You are not Authorized"
      });
    }
    const { id } = req.user;
    const result = await customerService.createAddress(req.body, id);
    sendResponse(res, {
      httpStatusCode: status7.OK,
      success: true,
      message: "Address added successfully",
      data: result
    });
  }
);
var getMyAddress2 = catchAsync(
  async (req, res) => {
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "You are not Authorized"
      });
    }
    const { id } = req.user;
    const result = await customerService.getMyAddress(id);
    sendResponse(res, {
      httpStatusCode: status7.OK,
      success: true,
      message: "Address fetched successfully",
      data: result
    });
  }
);
var updateAddress2 = catchAsync(
  async (req, res) => {
    console.log("hi");
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "You are not Authorized"
      });
    }
    const { id } = req.user;
    const result = await customerService.updateAddress(req.body, id);
    sendResponse(res, {
      httpStatusCode: status7.OK,
      success: true,
      message: "Profile updated successfully",
      data: result
    });
  }
);
var createReview2 = catchAsync(
  async (req, res) => {
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "You are not Authorized"
      });
    }
    const { id } = req.user;
    const result = await customerService.createReview(req.body, id);
    sendResponse(res, {
      httpStatusCode: status7.OK,
      success: true,
      message: "Review added successfully",
      data: result
    });
  }
);
var getReview2 = catchAsync(
  async (req, res) => {
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "You are not Authorized"
      });
    }
    const { id } = req.user;
    const result = await customerService.getReview(id);
    sendResponse(res, {
      httpStatusCode: status7.OK,
      success: true,
      message: "Review fetched successfully",
      data: result
    });
  }
);
var getSingleMedicineReview2 = catchAsync(
  async (req, res) => {
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "You are not Authorized"
      });
    }
    const { id } = req.user;
    const result = await customerService.getSingleMedicineReview(id);
    sendResponse(res, {
      httpStatusCode: status7.OK,
      success: true,
      message: "Review fetched successfully",
      data: result
    });
  }
);
var customerController = {
  getMyProfile: getMyProfile2,
  getMyOrder: getMyOrder2,
  editMyProfile: editMyProfile2,
  getSingleOrder: getSingleOrder4,
  addShippingAddress: addShippingAddress2,
  AddItemToCard: AddItemToCard2,
  getMyCartItem: getMyCartItem2,
  getMySingleCartItem: getMySingleCartItem2,
  DecrementCartItem: DecrementCartItem2,
  deleteCartItem: deleteCartItem2,
  createAddress: createAddress2,
  updateAddress: updateAddress2,
  getMyAddress: getMyAddress2,
  createReview: createReview2,
  getReview: getReview2,
  getSingleMedicineReview: getSingleMedicineReview2
};

// src/module/customer/customer.validation.ts
import z3 from "zod";
var createAddressZodSchema = z3.object({
  fullName: z3.string().min(1, "Full name is required").max(20, "Full name must be less than 20 characters").optional(),
  phone: z3.string().min(11, "Phone number must be at least 11 characters").max(14, "Phone number must be less than 14 characters").optional()
}).partial();
var createReviewZodSchema = z3.object({
  medicineId: z3.string().min(1, "Medicine ID is required"),
  description: z3.string().min(1, "Description is required").max(500, "Description must be less than 500 characters")
});

// src/module/customer/customer.route.ts
var router5 = express6.Router();
router5.get("/me", auth(Role.CUSTOMER, Role.ADMIN, Role.SELLER), customerController.getMyProfile);
router5.get("/orders", auth(Role.CUSTOMER), customerController.getMyOrder);
router5.get("/orders/:id", auth(Role.CUSTOMER, Role.ADMIN, Role.SELLER), customerController.getSingleOrder);
router5.post("/cart", auth(Role.CUSTOMER), customerController.AddItemToCard);
router5.post("/decrement", auth(Role.CUSTOMER), customerController.DecrementCartItem);
router5.get("/cart", auth(Role.CUSTOMER), customerController.getMyCartItem);
router5.get("/cart/:id", auth(Role.CUSTOMER), customerController.getMySingleCartItem);
router5.put("/profile", auth(Role.CUSTOMER, Role.ADMIN, Role.SELLER), customerController.editMyProfile);
router5.put("/checkout", auth(Role.CUSTOMER), customerController.addShippingAddress);
router5.delete("/:id", auth(Role.CUSTOMER), customerController.deleteCartItem);
router5.post("/address", validateRequest(createAddressZodSchema), auth(Role.CUSTOMER, Role.ADMIN, Role.SELLER), customerController.createAddress);
router5.put("/update-my-address", auth(Role.CUSTOMER, Role.SELLER, Role.ADMIN), customerController.updateAddress);
router5.post("/review", auth(Role.CUSTOMER), validateRequest(createReviewZodSchema), customerController.createReview);
router5.get("/review", auth(Role.CUSTOMER, Role.ADMIN, Role.SELLER), customerController.getReview);
router5.get("/review/:medicineId", auth(Role.CUSTOMER, Role.ADMIN, Role.SELLER), customerController.getSingleMedicineReview);
router5.get("/my-address", auth(Role.CUSTOMER, Role.ADMIN, Role.SELLER), customerController.getMyAddress);
var customerRouter = router5;

// src/app.ts
import cookieParser from "cookie-parser";

// src/module/payment/payment.route.ts
import { Router as Router7 } from "express";
var router6 = Router7();
var payment_route_default = router6;

// src/module/payment/payment.service.ts
var handlerStripeWebhookEvent = async (userId, event) => {
  const existingPayment = await prisma.payment.findFirst({
    where: {
      stripeEventId: event.id
    }
  });
  if (existingPayment) {
    return { message: `Event ${event.id} already processed` };
  }
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const orderId = session.metadata?.orderId;
      const paymentId = session.metadata?.paymentId;
      if (!orderId || !paymentId) {
        console.error("Missing orderId or paymentId in session metadata");
        return { message: "Missing orderId or paymentId in session metadata" };
      }
      const order = await prisma.order.findUnique({
        where: {
          id: orderId
        }
      });
      if (!order) {
        console.error(`Order with ID ${orderId} not found`);
        return { message: `Order with ID ${orderId} not found` };
      }
      await prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: {
            id: paymentId
          },
          data: {
            status: session.payment_status === "paid" ? PaymentStatus.PAID : PaymentStatus.UNPAID,
            stripeEventId: event.id
          }
        });
        const orderData = await tx.order.update({
          where: {
            id: orderId
          },
          data: {
            paymentStatus: session.payment_status === "paid" ? PaymentStatus.PAID : PaymentStatus.UNPAID,
            orderStatus: OrderStatus.CONFIRMED
          }
        });
        await tx.cart.deleteMany({
          where: {
            medicineId: orderData.medicineId,
            userId: orderData.userId
          }
        });
      });
      console.log(`Processed checkout.session.completed for appointment ${orderId} and payment ${paymentId}`);
      break;
    }
    case "checkout.session.expired": {
      const session = event.data.object;
      console.log(`Checkout session ${session.id} expired. Marking associated payment as failed.`);
      break;
    }
    case "payment_intent.payment_failed": {
      const session = event.data.object;
      console.log(`Payment intent ${session.id} failed. Marking associated payment as failed.`);
      break;
    }
    default:
      return { message: `Unhandled event type: ${event.type}` };
  }
};
var PaymentService = {
  handlerStripeWebhookEvent
};

// src/module/payment/payment.controller.ts
import status8 from "http-status";
var handleStripeWebhookEvent = catchAsync(
  async (req, res) => {
    const signature = req.headers["stripe-signature"];
    const webhookSecret = envVars.STRIPE_WEBHOOK_SECRET;
    if (!signature || !webhookSecret) {
      console.error("Missing Stripe signature or webhook secret");
      sendResponse(res, {
        httpStatusCode: status8.BAD_REQUEST,
        success: false,
        message: "Missing Stripe signature or webhook secret"
      });
    }
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
    } catch (error) {
      console.error("Error processing Stripe webhook:", error);
      sendResponse(res, {
        httpStatusCode: status8.BAD_REQUEST,
        success: false,
        message: "Error processing Stripe webhook"
      });
    }
    try {
      const result = await PaymentService.handlerStripeWebhookEvent(req.user?.id, event);
      sendResponse(res, {
        httpStatusCode: status8.OK,
        success: true,
        message: "Stripe webhook event processed successfully",
        data: result
      });
    } catch (error) {
      console.error("Error handling Stripe webhook event:", error);
      sendResponse(res, {
        httpStatusCode: status8.INTERNAL_SERVER_ERROR,
        success: false,
        message: "Error handling Stripe webhook event"
      });
    }
  }
);
var PaymentController = {
  handleStripeWebhookEvent
};

// src/middlewares/globalErrorHandler.ts
import status10 from "http-status";
import z4 from "zod";

// src/errorHelper/handleZodError.ts
import status9 from "http-status";
var handleZodError = (err) => {
  const statusCode = status9.BAD_REQUEST;
  const message = err.message || "Zod Validation Error from globalErrorHandler";
  const errorSource = [];
  err.issues.forEach((issue) => {
    errorSource.push({
      path: issue.path.join("."),
      message: issue.message
    });
  });
  return {
    success: false,
    message,
    errorSources: errorSource,
    statusCode
  };
};

// src/middlewares/globalErrorHandler.ts
var globalErrorHandler = async (err, req, res, next) => {
  if (envVars.NODE_ENV === "development") {
    console.error("Error from global error handler : ", err);
  }
  if (req.file) {
    await deleteFileFromCloudinary(req.file.path);
  }
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    const imageUrls = req.files.map((file) => file.path);
    await Promise.all(imageUrls.map((url) => deleteFileFromCloudinary(url)));
  }
  let errorSources = [];
  let statusCode = status10.INTERNAL_SERVER_ERROR;
  let message = "Internal Server Error";
  let stack = void 0;
  if (err instanceof z4.ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode || status10.BAD_REQUEST;
    if (err instanceof z4.ZodError) {
      const errors = err.issues;
      errors.forEach((e) => {
        message = e.message;
      });
    }
    errorSources = [...simplifiedError.errorSources];
    stack = err.stack;
  } else if (err instanceof AppError_default) {
    statusCode = err.statusCode;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "I am from global error handler and I am an instance of AppError",
        message: err.message
      }
    ];
  } else if (err instanceof Error) {
    statusCode = status10.INTERNAL_SERVER_ERROR;
    message = err.message;
    stack = err.stack;
    errorSources = [
      {
        path: "I am from global error handler and I am an instance of Error",
        message: err.message
      }
    ];
  }
  const errorResponse = {
    success: false,
    message,
    errorSources,
    stack: envVars.NODE_ENV === "development" ? stack : void 0,
    error: envVars.NODE_ENV === "development" ? err : void 0
  };
  res.status(statusCode).json(errorResponse);
};

// src/middlewares/notFound.ts
import status11 from "http-status";
var notFoundHandler = (req, res) => {
  res.status(status11.NOT_FOUND).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
};

// src/app.ts
import { toNodeHandler } from "better-auth/node";

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import nodemailer2 from "nodemailer";
import { bearer, emailOTP } from "better-auth/plugins";

// src/utils/email.ts
import nodemailer from "nodemailer";
import status12 from "http-status";
import path2 from "path";
import ejs from "ejs";
var transporter = nodemailer.createTransport({
  host: envVars.EMAIL_SENDER.SMTP_HOST,
  secure: true,
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS
  },
  port: Number(envVars.EMAIL_SENDER.SMTP_PORT)
});
var sendEmail = async ({ subject, templateData, templateName, to, attachments }) => {
  try {
    const templatePath = path2.resolve(process.cwd(), `src/templates/${templateName}.ejs`);
    const html = await ejs.renderFile(templatePath, templateData);
    const info = await transporter.sendMail({
      from: envVars.EMAIL_SENDER.SMTP_FROM,
      to,
      subject,
      html,
      attachments: attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType
      }))
    });
  } catch (error) {
    console.log("Email Sending Error", error.message);
    if (envVars.NODE_ENV === "development") {
      console.log(`[Development Mode] Bypassing email send error. Email details: to=${to}, subject=${subject}`);
      return;
    }
    throw new AppError_default(status12.INTERNAL_SERVER_ERROR, "Failed to send Email");
  }
};

// src/lib/auth.ts
var transporter2 = nodemailer2.createTransport({
  host: envVars.EMAIL_SENDER.SMTP_HOST,
  port: Number(envVars.EMAIL_SENDER.SMTP_PORT),
  secure: Number(envVars.EMAIL_SENDER.SMTP_PORT) === 465,
  family: 4,
  auth: {
    user: envVars.EMAIL_SENDER.SMTP_USER,
    pass: envVars.EMAIL_SENDER.SMTP_PASS
  }
});
var auth2 = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  trustedProxyHeaders: true,
  trustedOrigins: [
    envVars.FRONTEND_URL,
    envVars.APP_URL
  ],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: Role.CUSTOMER,
        required: false
      },
      userStatus: {
        type: "string",
        defaultValue: UserStatus.ACTIVE,
        required: false
      },
      needPasswordChange: {
        type: "boolean",
        defaultValue: false,
        required: false
      },
      isDeleted: {
        type: "boolean",
        defaultValue: false,
        required: false
      },
      deletedAt: {
        type: "date",
        defaultValue: null,
        required: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true
  },
  plugins: [
    bearer(),
    emailOTP({
      overrideDefaultEmailVerification: true,
      async sendVerificationOTP({ email, otp, type }) {
        if (type === "email-verification") {
          const user = await prisma.user.findUnique({
            where: {
              email
            }
          });
          if (user && !user.emailVerified) {
            console.log("-----------------------------------------");
            console.log(`[Better Auth OTP] Verification OTP for ${email}: ${otp}`);
            console.log("-----------------------------------------");
            sendEmail({
              to: email,
              subject: "Verify your Email",
              templateName: "otp",
              templateData: {
                name: user.name,
                otp
              }
            }).catch((error) => {
              console.error("An Error Occur to send Verification OTP (bypassed):", error);
            });
          }
        }
      },
      expiresIn: 2 * 60,
      // 2 min in seconds
      otpLength: 6
    })
  ],
  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const verificationUrl = `${envVars.APP_URL}/verify-email?token=${token}`;
      console.log("-----------------------------------------");
      console.log(`[Better Auth Link] Verification URL for ${user.email}:`);
      console.log(verificationUrl);
      console.log("-----------------------------------------");
      transporter2.sendMail({
        from: '"fgg" <u1904067@student.cuet.ac.bd>',
        to: user.email,
        subject: "Email verification for Medi Store",
        text: "Hello world?",
        html: `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Email Verification</title>
      </head>
      <body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8; padding:20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden;">
                
                <!-- Header -->
                <tr>
                  <td style="background-color:#2f80ed; padding:20px; text-align:center;">
                    <h1 style="margin:0; color:#ffffff; font-size:24px;">Medi Store</h1>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:30px; color:#333333;">
                    <h2 style="margin-top:0;">Verify your email address</h2>
                    <p style="font-size:15px; line-height:1.6;">
                      Thanks for signing up with <strong>Medi Store</strong>.
                      Please confirm your email address by clicking the button below.
                    </p>

                    <div style="text-align:center; margin:30px 0;">
                      <a href="${verificationUrl}"
                        style="background-color:#2f80ed; color:#ffffff; text-decoration:none;
                                padding:12px 24px; border-radius:5px; font-size:16px; display:inline-block;">
                        Verify Email
                      </a>
                    </div>

                    <p style="font-size:14px; line-height:1.6; color:#555555;">
                      If the button doesn\u2019t work, copy and paste this link into your browser:
                    </p>
                    <p style="word-break:break-all; font-size:13px; color:#2f80ed;">
                      ${verificationUrl}
                    </p>

                    <p style="font-size:14px; color:#777777;">
                      If you didn\u2019t create an account, you can safely ignore this email.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color:#f0f0f0; padding:15px; text-align:center; font-size:12px; color:#888888;">
                    \xA9 2026 Medi Store. All rights reserved.
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
                        `
      }).then((info) => {
        console.log("Message sent successfully:", info.messageId);
      }).catch((error) => {
        console.log("An Error Occur to send Email:", error);
        if (envVars.NODE_ENV !== "development") {
          console.error("[Production Mode] Email sending failed in background:", error);
        }
      });
    }
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET
    }
  }
});

// src/module/auth/auth.route.ts
import { Router as Router8 } from "express";

// src/module/auth/auth.service.ts
import status13 from "http-status";

// src/utils/token.ts
var getAccessToken = (payload) => {
  const accessToken = jwtUtils.createToken(
    payload,
    envVars.ACCESS_TOKEN_SECRET,
    { expiresIn: envVars.ACCESS_TOKEN_EXPIRES_IN }
  );
  return accessToken;
};
var getRefreshToken = (payload) => {
  const refreshToken = jwtUtils.createToken(
    payload,
    envVars.REFRESH_TOKEN_EXPIRES_IN,
    { expiresIn: envVars.REFRESH_TOKEN_EXPIRES_IN }
  );
  return refreshToken;
};
var setAccessTokenCookie = (res, token) => {
  CookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 60 * 24 * 1e3 * 10
  });
};
var setRefreshTokenCookie = (res, token) => {
  CookieUtils.setCookie(res, "refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 60 * 24 * 1e3 * 20
  });
};
var setBetterAuthSessionCookie = (res, token) => {
  CookieUtils.setCookie(res, "better-auth.session_token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 60 * 24 * 1e3 * 10
  });
};
var tokenUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBetterAuthSessionCookie
};

// src/module/auth/auth.service.ts
var registerCustomer = async (payload) => {
  const { name, email, password, image } = payload;
  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }
  const data = await auth2.api.signUpEmail({
    body: {
      name,
      email,
      password,
      role: Role.CUSTOMER,
      image
    }
  });
  console.log(data);
  if (!data.user) {
    throw new Error("Failed to create user");
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    name: data.user.name,
    email: data.user.email,
    role: data.user.role,
    userStatus: data.user.userStatus,
    emailVerified: data.user.emailVerified,
    isDeleted: data.user.isDeleted,
    needPasswordChange: data.user.needPasswordChange
  });
  const refreshToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    name: data.user.name,
    email: data.user.email,
    role: data.user.role,
    userStatus: data.user.userStatus,
    emailVerified: data.user.emailVerified,
    isDeleted: data.user.isDeleted,
    needPasswordChange: data.user.needPasswordChange
  });
  const customerTx = await prisma.customer.create({
    data: {
      userId: data.user.id,
      name: data.user.name,
      email: data.user.email
    }
  });
  await prisma.user.update({
    where: {
      id: customerTx.userId,
      role: Role.CUSTOMER
    },
    data: {
      emailVerified: true
    }
  });
  const signInData = await auth2.api.signInEmail({
    body: {
      email,
      password
    }
  });
  return {
    ...signInData,
    accessToken,
    refreshToken
  };
};
var loginUser = async (payload) => {
  const email = payload.email;
  const password = payload.password;
  if (!email || !password) {
    throw new Error("All fields are required");
  }
  const data = await auth2.api.signInEmail({
    body: {
      email,
      password
    }
  });
  if (!data.user) {
    throw new Error("Invalid credentials");
  }
  if (data.user.isDeleted || data.user.userStatus === UserStatus.DELETED) {
    throw new Error("Your account is deleted.");
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    name: data.user.name,
    email: data.user.email,
    role: data.user.role,
    userStatus: data.user.userStatus,
    emailVerified: data.user.emailVerified,
    isDeleted: data.user.isDeleted,
    needPasswordChange: data.user.needPasswordChange
  });
  const refreshToken = tokenUtils.getAccessToken({
    userId: data.user.id,
    name: data.user.name,
    email: data.user.email,
    role: data.user.role,
    userStatus: data.user.userStatus,
    emailVerified: data.user.emailVerified,
    isDeleted: data.user.isDeleted,
    needPasswordChange: data.user.needPasswordChange
  });
  return {
    ...data,
    accessToken,
    refreshToken
  };
};
var changePassword = async (payload, sessionToken) => {
  const session = await auth2.api.getSession({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  if (!session) {
    throw new AppError_default(status13.UNAUTHORIZED, "Invalid session token");
  }
  const { currentPassword, newPassword } = payload;
  const result = await auth2.api.changePassword({
    body: {
      currentPassword,
      newPassword,
      revokeOtherSessions: true
    },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  if (session.user.needPasswordChange) {
    await prisma.user.update({
      where: {
        id: session.user.id
      },
      data: {
        needPasswordChange: false
      }
    });
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role,
    userStatus: session.user.userStatus,
    emailVerified: session.user.emailVerified,
    isDeleted: session.user.isDeleted,
    needPasswordChange: session.user.needPasswordChange
  });
  const refreshToken = tokenUtils.getAccessToken({
    userId: session.user.id,
    name: session.user.name,
    email: session.user.email,
    role: session.user.role,
    userStatus: session.user.userStatus,
    emailVerified: session.user.emailVerified,
    isDeleted: session.user.isDeleted,
    needPasswordChange: session.user.needPasswordChange
  });
  return {
    ...result,
    accessToken,
    refreshToken
  };
};
var logoutUser = async (sessionToken) => {
  const result = await auth2.api.signOut({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`
    })
  });
  return result;
};
var verifyEmail = async (email, otp) => {
  const result = await auth2.api.verifyEmailOTP({
    body: {
      email,
      otp
    }
  });
  if (result.status && !result.user.emailVerified) {
    await prisma.user.update({
      where: {
        email
      },
      data: {
        emailVerified: true
      }
    });
  }
};
var sessionToToken = async (sessionToken) => {
  if (!sessionToken) {
    throw new AppError_default(status13.UNAUTHORIZED, "Session token is missing");
  }
  const parsedSessionToken = sessionToken.split(".")[0] ?? "";
  const sessionExists = await prisma.session.findFirst({
    where: {
      token: parsedSessionToken,
      expiresAt: {
        gt: /* @__PURE__ */ new Date()
      }
    },
    include: {
      user: true
    }
  });
  if (!sessionExists) {
    throw new AppError_default(status13.UNAUTHORIZED, "Session has expired or is invalid");
  }
  const user = sessionExists.user;
  if (user.role === Role.CUSTOMER) {
    const customer = await prisma.customer.findUnique({
      where: { userId: user.id }
    });
    if (!customer) {
      await prisma.customer.create({
        data: {
          userId: user.id,
          name: user.name || user.email.split("@")[0] || "",
          email: user.email
        }
      });
    }
  } else if (user.role === Role.SELLER) {
    const seller = await prisma.seller.findUnique({
      where: { userId: user.id }
    });
    if (!seller) {
      await prisma.seller.create({
        data: {
          userId: user.id,
          name: user.name || user.email.split("@")[0] || "",
          email: user.email
        }
      });
    }
  } else if (user.role === Role.ADMIN) {
    const admin = await prisma.admin.findUnique({
      where: { userId: user.id }
    });
    if (!admin) {
      await prisma.admin.create({
        data: {
          userId: user.id,
          name: user.name || user.email.split("@")[0] || "",
          email: user.email
        }
      });
    }
  }
  const accessToken = tokenUtils.getAccessToken({
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    userStatus: user.userStatus,
    emailVerified: user.emailVerified,
    isDeleted: user.isDeleted,
    needPasswordChange: user.needPasswordChange
  });
  const refreshToken = tokenUtils.getAccessToken({
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    userStatus: user.userStatus,
    emailVerified: user.emailVerified,
    isDeleted: user.isDeleted,
    needPasswordChange: user.needPasswordChange
  });
  return {
    accessToken,
    refreshToken,
    token: sessionToken,
    user
  };
};
var AuthService = {
  registerCustomer,
  loginUser,
  changePassword,
  logoutUser,
  verifyEmail,
  sessionToToken
};

// src/module/auth/auth.controller.ts
import status14 from "http-status";
var registerCustomer2 = catchAsync(
  async (req, res) => {
    const payload = {
      ...req.body,
      image: req.file?.path
    };
    const result = await AuthService.registerCustomer(payload);
    const { accessToken, refreshToken, token, ...rest } = result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token);
    sendResponse(res, {
      httpStatusCode: 201,
      success: true,
      message: "Customer registered successfully",
      data: {
        token,
        accessToken,
        refreshToken,
        ...rest
      }
    });
  }
);
var loginUser2 = catchAsync(
  async (req, res) => {
    const payload = req.body;
    const result = await AuthService.loginUser(payload);
    const { accessToken, refreshToken, token, ...rest } = result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token);
    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "User logged in successfully",
      data: {
        token,
        accessToken,
        refreshToken,
        ...rest
      }
    });
  }
);
var changePassword2 = catchAsync(
  async (req, res) => {
    const payload = req.body;
    const sessionToken = req.cookies["better-auth.session_token"] || req.cookies["__Secure-better-auth.session_token"];
    const result = await AuthService.changePassword(payload, sessionToken);
    const { accessToken, refreshToken, token } = result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSessionCookie(res, token);
    sendResponse(res, {
      httpStatusCode: status14.OK,
      success: true,
      message: "Password Change Successfully",
      data: result
    });
  }
);
var logoutUser2 = catchAsync(
  async (req, res) => {
    const sessionToken = req.cookies["better-auth.session_token"] || req.cookies["__Secure-better-auth.session_token"];
    const result = await AuthService.logoutUser(sessionToken);
    sendResponse(res, {
      httpStatusCode: status14.OK,
      success: true,
      message: "User Log Out Successfully",
      data: result
    });
  }
);
var verifyEmail2 = catchAsync(
  async (req, res) => {
    const { email, otp } = req.body;
    const result = await AuthService.verifyEmail(email, otp);
    sendResponse(res, {
      httpStatusCode: status14.OK,
      success: true,
      message: "Email verified successfully"
    });
  }
);
var sessionToToken2 = catchAsync(
  async (req, res) => {
    const sessionToken = req.cookies["better-auth.session_token"] || req.cookies["__Secure-better-auth.session_token"] || req.headers["x-session-token"];
    const result = await AuthService.sessionToToken(sessionToken);
    const { accessToken, refreshToken, token, user } = result;
    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Session token exchanged successfully",
      data: {
        accessToken,
        refreshToken,
        token,
        user
      }
    });
  }
);
var AuthController = {
  registerCustomer: registerCustomer2,
  loginUser: loginUser2,
  changePassword: changePassword2,
  logoutUser: logoutUser2,
  verifyEmail: verifyEmail2,
  sessionToToken: sessionToToken2
};

// src/module/auth/auth.validation.ts
import z5 from "zod";
var CreateCustomerZodSchema = z5.object({
  name: z5.string().min(1, "Name is required").max(15, "Name must be less than 15 characters"),
  email: z5.email("Invalid email address"),
  password: z5.string().min(6, "Password must be at least 6 characters long"),
  image: z5.url("Invalid image URL").optional()
});
var LoginZodSchema = z5.object({
  email: z5.email("Invalid email address"),
  password: z5.string().min(6, "Password must be at least 6 characters long")
});

// src/module/auth/auth.route.ts
var router7 = Router8();
router7.post("/register", multerUpload.single("file"), validateRequest(CreateCustomerZodSchema), AuthController.registerCustomer);
router7.post("/login", AuthController.loginUser);
router7.post("/change-password", auth(Role.ADMIN, Role.CUSTOMER, Role.SELLER), AuthController.changePassword);
router7.post("/logout", auth(Role.ADMIN, Role.CUSTOMER, Role.SELLER), AuthController.logoutUser);
router7.post("/verify-email", AuthController.verifyEmail);
router7.post("/session-to-token", AuthController.sessionToToken);
var AuthRoutes = router7;

// src/app.ts
var app = express7();
app.use(cors({
  origin: [envVars.APP_URL, envVars.FRONTEND_URL],
  credentials: true
}));
app.post("/webhook", express7.raw({ type: "application/json" }), PaymentController.handleStripeWebhookEvent);
app.all("/api/auth/*splat", multerUpload.single("file"), toNodeHandler(auth2));
app.use(express7.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express7.json());
app.use(express7.urlencoded({ extended: true }));
app.use("/api/payment", payment_route_default);
app.use("/auth", AuthRoutes);
app.use("/api/customer", customerRouter);
app.use("/api/categories", categoryRoute);
app.use("/api/medicines", medicineRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/orders", orderRoute);
app.use("/api/admin", adminRoute);
app.get("/", (req, res) => {
  res.send("Hello World !!");
});
app.use(globalErrorHandler);
app.use(notFoundHandler);
var app_default = app;

// src/server.ts
async function main() {
  try {
    await prisma.$connect();
    console.log("Database connection successfully");
    app_default.listen(envVars.PORT, () => {
      console.log(`Server is running on http://localhost:${envVars.PORT}`);
    });
  } catch (error) {
    console.log("error => ", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}
main();
//! customer
//! medicine
//! seller
//! orders
//! admin
