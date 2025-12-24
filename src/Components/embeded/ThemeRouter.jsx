import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NotFound from '../ProtectedRoute/NotFound';
import AppointmentBooking2 from './Theme-2/AppointmentBooking2';
import AppointmentBooking_3 from './Theme-3/AppointmentBooking-3';
import AppointmentBooking from './AppointmentBooking';
import Loader from '../Loader';
import AppointmentBooking_4 from './Theme-4/AppointmentBooking-4';

const ThemeRouter = () => {
  const { idSpace, idAdmin, idCustomer, id } = useParams(); 
  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  console.log(theme);
console.log(id);

  useEffect(() => {
    const fetchTheme = async () => {
      let apiUrl = '';
      
      if (id) {
        apiUrl = `https://backend-booking.appointroll.com/api/public/book/resource?interview_share_link=${id}`;
      } else if (idSpace) {
        apiUrl = `https://backend-booking.appointroll.com/api/public/book/resource?workspace_share_link=${idSpace}`;
      } else if (idAdmin) {
        apiUrl = `https://backend-booking.appointroll.com/api/public/book/resource?customer_share_link=${idAdmin}`;
      } else if (idCustomer) {
        apiUrl = `https://backend-booking.appointroll.com/api/public/book/resource?staff_share_link=${idCustomer}`;
      } else {
        setTheme(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(false);

      try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          setError(true);
          setLoading(false);
          return;
        }

        const data = await response.json();
        const themeData = data?.data?.theme?.theme;
        setTheme(themeData);
        
      } catch (err) {
        console.error('Error fetching theme:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTheme();
  }, [idSpace, idAdmin, idCustomer, id]); 

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <NotFound />;
  }

  if (theme === 'theme1') {
    return <AppointmentBooking2 />;
  }
  if (theme === 'theme3') {
    return <AppointmentBooking_4 />;
  }

  if (theme === 'theme5') {
    return <AppointmentBooking_3 />;
  }

  return <AppointmentBooking />;
};

export default ThemeRouter;