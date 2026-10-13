import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';

export const seedDefaultUsers = async () => {
  try {
    
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || 'System Admin';

    if (adminEmail && adminPassword) {
      const isAdminExists = await prisma.user.findUnique({
        where: { email: adminEmail },
      });

      if (!isAdminExists) {
        const hashedAdminPassword = await bcrypt.hash(adminPassword, 12);
        await prisma.user.create({
          data: {
            name: adminName,
            email: adminEmail,
            password: hashedAdminPassword,
            phone: '01711000001',
            role: 'ADMIN',
            isVerified: true,
          },
        });
        console.log(`✅ Default ADMIN created: ${adminEmail}`);
      }
    }

    
    const driverEmail = process.env.DRIVER_EMAIL;
    const driverPassword = process.env.DRIVER_PASSWORD;
    const driverName = process.env.DRIVER_NAME || 'Default Driver';

    if (driverEmail && driverPassword) {
      const isDriverExists = await prisma.user.findUnique({
        where: { email: driverEmail },
      });

      if (!isDriverExists) {
        const hashedDriverPassword = await bcrypt.hash(driverPassword, 12);
        await prisma.user.create({
          data: {
            name: driverName,
            email: driverEmail,
            password: hashedDriverPassword,
            phone: '01711000002',
            role: 'DRIVER',
            isVerified: true,
          },
        });
        console.log(`✅ Default DRIVER created: ${driverEmail}`);
      }
    }

    
    const callerEmail = process.env.CALLER_EMAIL;
    const callerPassword = process.env.CALLER_PASSWORD;
    const callerName = process.env.CALLER_NAME || 'Default Caller';

    if (callerEmail && callerPassword) {
      const isCallerExists = await prisma.user.findUnique({
        where: { email: callerEmail },
      });

      if (!isCallerExists) {
        const hashedCallerPassword = await bcrypt.hash(callerPassword, 12);
        await prisma.user.create({
          data: {
            name: callerName,
            email: callerEmail,
            password: hashedCallerPassword,
            phone: '01711000003',
            role: 'CALLER',
            isVerified: true,
          },
        });
        console.log(`✅ Default CALLER created: ${callerEmail}`);
      }
    }
  } catch (error) {
    console.error('❌ Failed to seed default users from .env:', error);
  }
};