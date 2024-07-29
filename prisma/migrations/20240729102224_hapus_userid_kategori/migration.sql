/*
  Warnings:

  - You are about to drop the column `userId` on the `Kategori` table. All the data in the column will be lost.
  - You are about to drop the `_KategoriToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_KategoriToUser" DROP CONSTRAINT "_KategoriToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_KategoriToUser" DROP CONSTRAINT "_KategoriToUser_B_fkey";

-- AlterTable
ALTER TABLE "Kategori" DROP COLUMN "userId";

-- DropTable
DROP TABLE "_KategoriToUser";
