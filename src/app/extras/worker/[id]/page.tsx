import { getStaff } from '../../actions';
import prisma from '@/lib/prisma';
import WorkerFormClient from './WorkerFormClient';



export default async function WorkerFormPage({ params }: { params: Promise<{ id: string }> }) {
  const taskId = Number((await params).id);
  const task = await prisma.extrasWorkRecord.findUnique({ where: { id: taskId } });
  const staffList = await getStaff();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <WorkerFormClient task={task} staffList={staffList} />
    </div>
  );
}
