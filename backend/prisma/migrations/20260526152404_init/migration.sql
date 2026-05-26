-- CreateTable
CREATE TABLE "cliente" (
    "id" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "propiedad" (
    "id" SERIAL NOT NULL,
    "idVendedor" INTEGER NOT NULL,
    "direccion" TEXT NOT NULL,
    "zona" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "habitaciones" INTEGER NOT NULL,
    "cantidadBanos" INTEGER NOT NULL,
    "metrosCuadrados" DOUBLE PRECISION NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,
    "estado" TEXT NOT NULL,

    CONSTRAINT "propiedad_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "venta" (
    "id" SERIAL NOT NULL,
    "idComprador" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "montoTotal" DOUBLE PRECISION NOT NULL,
    "idPropiedad" INTEGER NOT NULL,

    CONSTRAINT "venta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "venta_idPropiedad_key" ON "venta"("idPropiedad");

-- AddForeignKey
ALTER TABLE "propiedad" ADD CONSTRAINT "propiedad_idVendedor_fkey" FOREIGN KEY ("idVendedor") REFERENCES "cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "venta" ADD CONSTRAINT "venta_idComprador_fkey" FOREIGN KEY ("idComprador") REFERENCES "cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "venta" ADD CONSTRAINT "venta_idPropiedad_fkey" FOREIGN KEY ("idPropiedad") REFERENCES "propiedad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
