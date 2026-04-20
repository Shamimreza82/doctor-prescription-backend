/*
  Warnings:

  - You are about to drop the column `bucket` on the `files` table. All the data in the column will be lost.
  - You are about to drop the column `checksum` on the `files` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_at` on the `files` table. All the data in the column will be lost.
  - You are about to drop the column `extension` on the `files` table. All the data in the column will be lost.
  - You are about to drop the column `file_name` on the `files` table. All the data in the column will be lost.
  - You are about to drop the column `is_public` on the `files` table. All the data in the column will be lost.
  - You are about to drop the column `storage_provider` on the `files` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `files` table. All the data in the column will be lost.
  - Made the column `entity_type` on table `files` required. This step will fail if there are existing NULL values in that column.
  - Made the column `entity_id` on table `files` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_tenant_id_fkey";

-- DropIndex
DROP INDEX "files_entity_type_entity_id_idx";

-- DropIndex
DROP INDEX "files_tenant_id_idx";

-- AlterTable
ALTER TABLE "files" DROP COLUMN "bucket",
DROP COLUMN "checksum",
DROP COLUMN "deleted_at",
DROP COLUMN "extension",
DROP COLUMN "file_name",
DROP COLUMN "is_public",
DROP COLUMN "storage_provider",
DROP COLUMN "url",
ADD COLUMN     "category" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "title" TEXT,
ALTER COLUMN "entity_type" SET NOT NULL,
ALTER COLUMN "entity_id" SET NOT NULL;

-- CreateIndex
CREATE INDEX "files_tenant_id_entity_type_entity_id_idx" ON "files"("tenant_id", "entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "files_uploaded_by_id_idx" ON "files"("uploaded_by_id");

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
