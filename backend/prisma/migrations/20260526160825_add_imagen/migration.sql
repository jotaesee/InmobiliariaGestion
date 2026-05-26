-- CreateTable
CREATE TABLE "imagen" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "esPortada" BOOLEAN NOT NULL DEFAULT false,
    "idPropiedad" INTEGER NOT NULL,

    CONSTRAINT "imagen_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "imagen" ADD CONSTRAINT "imagen_idPropiedad_fkey" FOREIGN KEY ("idPropiedad") REFERENCES "propiedad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
