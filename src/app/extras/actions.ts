'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';



// Task Types
export async function getTaskTypes() {
  return await prisma.extrasTaskType.findMany({
    orderBy: { name: 'asc' }
  });
}

export async function addTaskType(name: string) {
  await prisma.extrasTaskType.create({
    data: { name, createdAt: new Date().toISOString() }
  });
  revalidatePath('/extras/admin/tasks');
  revalidatePath('/extras/encargado');
}

export async function updateTaskType(id: number, name: string) {
  await prisma.extrasTaskType.update({
    where: { id },
    data: { name }
  });
  revalidatePath('/extras/admin/tasks');
}

export async function deleteTaskType(id: number) {
  await prisma.extrasTaskType.delete({
    where: { id }
  });
  revalidatePath('/extras/admin/tasks');
}

// Staff
export async function getStaff() {
  return await prisma.extrasStaff.findMany({
    orderBy: { fullName: 'asc' }
  });
}

export async function addStaff(fullName: string, cedula: string) {
  await prisma.extrasStaff.create({
    data: { fullName, cedula, createdAt: new Date().toISOString() }
  });
  revalidatePath('/extras/admin/staff');
}

export async function updateStaff(id: number, fullName: string, cedula: string) {
  await prisma.extrasStaff.update({
    where: { id },
    data: { fullName, cedula }
  });
  revalidatePath('/extras/admin/staff');
}

export async function deleteStaff(id: number) {
  await prisma.extrasStaff.delete({
    where: { id }
  });
  revalidatePath('/extras/admin/staff');
}

export async function loginAction(username: string, password: string) {
  const user = await prisma.extrasAdminUser.findUnique({ where: { username } });
  if (!user || user.password !== password) {
    throw new Error('Usuario o contraseña incorrectos');
  }
  return { username: user.username, role: user.role };
}

// Admin Users
export async function getAdminUsers() {
  return await prisma.extrasAdminUser.findMany({
    orderBy: { username: 'asc' }
  });
}

export async function addAdminUser(username: string, role: string) {
  // Hardcoded password for simplicity, as old app used plaintext or similar
  await prisma.extrasAdminUser.create({
    data: { username, role, password: '123' } // default password
  });
  revalidatePath('/extras/admin/encargados');
}

export async function deleteAdminUser(id: number) {
  await prisma.extrasAdminUser.delete({
    where: { id }
  });
  revalidatePath('/extras/admin/encargados');
}

// Records
export async function getPendingTasks() {
  return await prisma.extrasWorkRecord.findMany({
    where: { status: 'PENDING' },
    orderBy: { id: 'desc' }
  });
}

export async function getMyPendingTasks(requestedBy: string) {
  return await prisma.extrasWorkRecord.findMany({
    where: { status: 'PENDING', requestedBy },
    orderBy: { id: 'desc' }
  });
}

export async function getTasksAwaitingVerification() {
  return await prisma.extrasWorkRecord.findMany({
    where: { status: 'VERIFYING' },
    orderBy: { id: 'desc' }
  });
}

export async function getAllRecords() {
  return await prisma.extrasWorkRecord.findMany({
    orderBy: { id: 'desc' }
  });
}

export async function requestTask(typeId: number, sector: string, description: string, requestedBy: string) {
  const type = await prisma.extrasTaskType.findUnique({ where: { id: typeId } });
  if (!type) throw new Error('Tipo no encontrado');

  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  await prisma.extrasWorkRecord.create({
    data: {
      taskTypeId: typeId,
      taskTypeName: type.name,
      sector,
      description,
      requestedBy,
      status: 'PENDING',
      createdAt: now.toISOString(),
      monthKey
    }
  });
  revalidatePath('/extras/encargado');
  revalidatePath('/extras');
}

export async function cancelTask(id: number) {
  await prisma.extrasWorkRecord.delete({ where: { id } });
  revalidatePath('/extras/encargado');
  revalidatePath('/extras');
}

export async function executeTask(id: number, staffId: number, photosBefore: string[], photosAfter: string[], workerComments: string) {
  const staff = await prisma.extrasStaff.findUnique({ where: { id } });
  
  // Note: photosBefore and photosAfter are arrays of strings, but DB stores a string.
  // We'll join them by comma or store them as JSON stringified strings.
  await prisma.extrasWorkRecord.update({
    where: { id },
    data: {
      staffId: staffId,
      staffName: staff?.fullName,
      staffCedula: staff?.cedula,
      photosBefore: JSON.stringify(photosBefore),
      photosAfter: JSON.stringify(photosAfter),
      workerComments,
      status: 'VERIFYING'
    }
  });
  revalidatePath('/extras');
  revalidatePath('/extras/encargado');
}

export async function verifyTask(id: number, signatureBase64: string) {
  // Generate random order number or use max + 1
  const maxRecord = await prisma.extrasWorkRecord.findFirst({
    orderBy: { orderNumber: 'desc' }
  });
  const orderNumber = (maxRecord?.orderNumber || 0) + 1;

  await prisma.extrasWorkRecord.update({
    where: { id },
    data: {
      encargadoSignature: signatureBase64,
      orderNumber,
      status: 'COMPLETED'
    }
  });
  revalidatePath('/extras/encargado');
  revalidatePath('/extras/admin/records');
}
