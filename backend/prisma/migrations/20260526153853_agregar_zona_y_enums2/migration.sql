/*
  Warnings:

  - You are about to drop the column `zona` on the `propiedad` table. All the data in the column will be lost.
  - Added the required column `idZona` to the `propiedad` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "propiedad" DROP COLUMN "zona",
ADD COLUMN     "idZona" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "propiedad" ADD CONSTRAINT "propiedad_idZona_fkey" FOREIGN KEY ("idZona") REFERENCES "zona"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
