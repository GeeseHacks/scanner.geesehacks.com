-- CreateTable
CREATE TABLE "ScannerUserAuth" (
    "id" VARCHAR(36) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(60) NOT NULL,

    CONSTRAINT "ScannerUserAuth_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ScannerUserAuth_email_key" ON "ScannerUserAuth"("email");
