-- CreateEnum
CREATE TYPE "Role" AS ENUM ('VIEWER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Method" AS ENUM ('GET', 'POST', 'PATCH', 'DELETE');

-- CreateEnum
CREATE TYPE "InvStatus" AS ENUM ('WITNESS', 'SUSPECT', 'GUILTY', 'VICTIM');

-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "patronymic" TEXT,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'VIEWER',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Route" (
    "route_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Route_pkey" PRIMARY KEY ("route_id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "permission_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "method" "Method" NOT NULL,
    "route_id" INTEGER NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("permission_id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "role_permission_id" SERIAL NOT NULL,
    "role" "Role" NOT NULL,
    "permission_id" INTEGER NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("role_permission_id")
);

-- CreateTable
CREATE TABLE "UserPermission" (
    "user_permission_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,

    CONSTRAINT "UserPermission_pkey" PRIMARY KEY ("user_permission_id")
);

-- CreateTable
CREATE TABLE "IncidentType" (
    "incident_type_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "IncidentType_pkey" PRIMARY KEY ("incident_type_id")
);

-- CreateTable
CREATE TABLE "IncidentStatus" (
    "incident_status_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "IncidentStatus_pkey" PRIMARY KEY ("incident_status_id")
);

-- CreateTable
CREATE TABLE "Incident" (
    "incident_id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "incident_type_id" INTEGER NOT NULL,
    "description" TEXT,
    "incident_status_id" INTEGER NOT NULL,
    "reg_number" TEXT,

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("incident_id")
);

-- CreateTable
CREATE TABLE "Participant" (
    "participant_id" SERIAL NOT NULL,
    "surname" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "patronymic" TEXT,
    "address" TEXT NOT NULL,
    "crimial_records" INTEGER NOT NULL,

    CONSTRAINT "Participant_pkey" PRIMARY KEY ("participant_id")
);

-- CreateTable
CREATE TABLE "Involvement" (
    "involvement_id" SERIAL NOT NULL,
    "participant_id" INTEGER NOT NULL,
    "incident_id" INTEGER NOT NULL,
    "status" "InvStatus" NOT NULL,

    CONSTRAINT "Involvement_pkey" PRIMARY KEY ("involvement_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Route_name_key" ON "Route"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_name_key" ON "Permission"("name");

-- CreateIndex
CREATE UNIQUE INDEX "IncidentType_name_key" ON "IncidentType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "IncidentStatus_name_key" ON "IncidentStatus"("name");

-- AddForeignKey
ALTER TABLE "Permission" ADD CONSTRAINT "Permission_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "Route"("route_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "Permission"("permission_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPermission" ADD CONSTRAINT "UserPermission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "Permission"("permission_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_incident_type_id_fkey" FOREIGN KEY ("incident_type_id") REFERENCES "IncidentType"("incident_type_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_incident_status_id_fkey" FOREIGN KEY ("incident_status_id") REFERENCES "IncidentStatus"("incident_status_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Involvement" ADD CONSTRAINT "Involvement_participant_id_fkey" FOREIGN KEY ("participant_id") REFERENCES "Participant"("participant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Involvement" ADD CONSTRAINT "Involvement_incident_id_fkey" FOREIGN KEY ("incident_id") REFERENCES "Incident"("incident_id") ON DELETE CASCADE ON UPDATE CASCADE;
