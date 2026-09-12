import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { ChatMessage } from '../models/ChatMessage';
import { LocationTracking } from '../models/LocationTracking';
import { Notification } from '../models/Notification';

export const initializeSocket = (io: Server) => {

  io.use(async (socket: Socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return next(new Error('User not found'));
      }

      (socket as any).user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user = (socket as any).user;
    console.log(`User connected: ${user._id}`);


    socket.join(user._id.toString());


    socket.on('join-booking', (bookingId: string) => {

      socket.join(`booking_${bookingId}`);
      console.log(`User ${user._id} joined booking room ${bookingId}`);
    });


    socket.on('send-message', async (data: { bookingId: string, receiverId: string, text: string }) => {
      try {
        const message = await ChatMessage.create({
          bookingId: data.bookingId,
          senderId: user._id,
          receiverId: data.receiverId,
          text: data.text
        });


        io.to(`booking_${data.bookingId}`).emit('new-message', message);
        

        const notification = await Notification.create({
          user: data.receiverId,
          title: 'New Message',
          message: `You have a new message from ${user.name}`,
          type: 'SYSTEM',
          relatedId: data.bookingId
        });
        io.to(data.receiverId.toString()).emit('new-notification', notification);

      } catch (error) {
        console.error('Message error:', error);
      }
    });


    socket.on('update-location', async (data: { bookingId: string, latitude: number, longitude: number }) => {
      if (user.role !== 'TECHNICIAN') return;

      try {
        await LocationTracking.findOneAndUpdate(
          { bookingId: data.bookingId },
          { 
            technicianId: user._id,
            latitude: data.latitude, 
            longitude: data.longitude 
          },
          { upsert: true, new: true }
        );


        io.to(`booking_${data.bookingId}`).emit('location-updated', {
          latitude: data.latitude,
          longitude: data.longitude
        });
      } catch (error) {
        console.error('Location update error:', error);
      }
    });


    socket.on('typing', (data: { bookingId: string }) => {
      socket.to(`booking_${data.bookingId}`).emit('user-typing', { userId: user._id });
    });



    socket.on('update-booking-status', (data: { bookingId: string, status: string }) => {
      io.to(`booking_${data.bookingId}`).emit('booking-status-changed', { status: data.status });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${user._id}`);
    });
  });
};
