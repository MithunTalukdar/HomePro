async function run() {
  try {

    let token = '';
    const email = `test_${Date.now()}@test.com`;
    try {
      const res = await fetch('http://127.0.0.1:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          email,
          phone: `1234${Date.now().toString().slice(-6)}`,
          password: 'password123'
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Register failed');
      token = data.token;
      console.log('Registered token:', token);
    } catch (e) {
      console.log('Register failed:', e.message);
      return;
    }


    try {
      const res = await fetch('http://127.0.0.1:5000/api/bookings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({
          serviceId: 'electrical-repair',
          serviceName: 'Electrical Repair',
          date: 'Sun Oct 15',
          timeSlot: '09:00 AM - 11:00 AM',
          address: {
            address: '123 Test St',
            city: 'Default City',
            pincode: '000000'
          },
          price: '₹999'
        })
      });
      const data = await res.json();
      if (!res.ok) {
        console.log('Booking failed:', data);
      } else {
        console.log('Booking created:', data);
      }
    } catch (e) {
      console.log('Booking request failed:', e);
    }
  } catch (err) {
    console.log(err);
  }
}

run();
