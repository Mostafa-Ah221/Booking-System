import { useParams, useSearchParams } from 'react-router-dom';
import Page2 from './Page2';
import Page3 from './Page3';
import Page4 from './Page4';
import AppointmentBooking from './AppointmentBooking';

const SmartRouter = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');

  // حسب الـ type، ارجع المكون المناسب
  if (type === 'admin') return <Page2 />;
  if (type === 'customer') return <Page3 />;
  if (type === 'space') return <Page4 />;
  return <AppointmentBooking />;
};
export default SmartRouter;