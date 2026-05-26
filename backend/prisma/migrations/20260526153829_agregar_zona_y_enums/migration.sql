/*
  Warnings:

  - The `estado` column on the `propiedad` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "estadoPropiedad" AS ENUM ('DISPONIBLE', 'VENDIDA', 'ARCHIVADA');

-- AlterTable
ALTER TABLE "propiedad" DROP COLUMN "estado",
ADD COLUMN     "estado" "estadoPropiedad" NOT NULL DEFAULT 'DISPONIBLE';

-- CreateTable
CREATE TABLE "zona" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "zona_pkey" PRIMARY KEY ("id")
);
