import { getTaskTypes, getMyPendingTasks, getTasksAwaitingVerification } from '../actions';
import EncargadoClient from './EncargadoClient';

export default async function EncargadoPage() {
  const taskTypes = await getTaskTypes();
  const allPending = await getMyPendingTasks(''); // Actually, we'll fetch them inside or filter inside client if needed. Wait, in Server Actions we need to pass the requestedBy to getMyPendingTasks, but the server doesn't know the requestedBy (it's in sessionStorage). Let's just fetch all pending tasks and filter them on the client.

  const { getPendingTasks } = await import('../actions');
  const pendingTasks = await getPendingTasks();
  const awaitingVerify = await getTasksAwaitingVerification();

  return (
    <div className="animate-in fade-in duration-500">
      <EncargadoClient 
        taskTypes={taskTypes} 
        myPending={pendingTasks} 
        awaitingVerify={awaitingVerify} 
      />
    </div>
  );
}
