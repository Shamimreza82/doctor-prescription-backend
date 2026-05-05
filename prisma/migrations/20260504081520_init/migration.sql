-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'REVOKED');

-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'MR';

-- CreateTable
CREATE TABLE "mr_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "employee_id" TEXT,
    "designation" TEXT,
    "territory" TEXT,
    "region" TEXT,
    "zone" TEXT,
    "company_name" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "total_visits" INTEGER NOT NULL DEFAULT 0,
    "last_visit_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mr_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mr_doctor_assignments" (
    "id" TEXT NOT NULL,
    "mr_id" TEXT NOT NULL,
    "doctor_id" TEXT NOT NULL,
    "assigned_by" TEXT,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "AssignmentStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "mr_doctor_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mr_profiles_user_id_key" ON "mr_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "mr_profiles_employee_id_key" ON "mr_profiles"("employee_id");

-- CreateIndex
CREATE INDEX "mr_doctor_assignments_mr_id_idx" ON "mr_doctor_assignments"("mr_id");

-- CreateIndex
CREATE INDEX "mr_doctor_assignments_doctor_id_idx" ON "mr_doctor_assignments"("doctor_id");

-- CreateIndex
CREATE UNIQUE INDEX "mr_doctor_assignments_mr_id_doctor_id_key" ON "mr_doctor_assignments"("mr_id", "doctor_id");

-- AddForeignKey
ALTER TABLE "mr_profiles" ADD CONSTRAINT "mr_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mr_profiles" ADD CONSTRAINT "mr_profiles_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mr_doctor_assignments" ADD CONSTRAINT "mr_doctor_assignments_mr_id_fkey" FOREIGN KEY ("mr_id") REFERENCES "mr_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mr_doctor_assignments" ADD CONSTRAINT "mr_doctor_assignments_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctor_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
