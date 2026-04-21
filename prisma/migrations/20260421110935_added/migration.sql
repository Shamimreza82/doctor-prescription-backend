/*
  Warnings:

  - Added the required column `patient_id` to the `files` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_uploaded_by_id_fkey";

-- DropForeignKey
ALTER TABLE "tenants" DROP CONSTRAINT "tenants_owner_user_id_fkey";

-- AlterTable
ALTER TABLE "files" ADD COLUMN     "patient_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_owner_user_id_fkey" FOREIGN KEY ("owner_user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
