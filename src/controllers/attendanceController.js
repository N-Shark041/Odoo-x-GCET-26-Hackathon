
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTodayStatus = async (req, res) => {
  try {
    const userId = req.userId;
    const today = new Date().toISOString().split('T')[0];

    // Find the record for today specifically
    const records = await prisma.attendance.findMany({
      where: { userId }
    });
    
    const todayRecord = records.find(r => r.date.startsWith(today));

    return res.status(200).json({ 
      success: true, 
      data: todayRecord || null 
    });

  } catch (error) {
    console.error("GetTodayStatus Error:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Could not fetch today's status" 
    });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const userId = req.userId;
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toISOString();

    // 1. Check for existing record
    const records = await prisma.attendance.findMany({
      where: { userId }
    });
    const existing = records.find(r => r.date.startsWith(today));

    if (!existing) {
      // 2. Action: Clock In
      const record = await prisma.attendance.create({
        data: {
          userId,
          date: today,
          checkIn: now,
          status: "Present"
        }
      });

      return res.status(201).json({ 
        success: true, 
        message: "Clock-in successful",
        status: "CHECKED_IN",
        data: record 
      });
    }

    if (existing.checkIn && !existing.checkOut) {
      // 3. Action: Clock Out
      const record = await prisma.attendance.update({
        where: { id: existing.id },
        data: {
          checkOut: now
        }
      });

      return res.status(200).json({ 
        success: true, 
        message: "Clock-out successful",
        status: "CHECKED_OUT",
        data: record 
      });
    }

    return res.status(400).json({ 
      success: false, 
      error: "Workday already finalized. You have already clocked out for today." 
    });

  } catch (error) {
    console.error("MarkAttendance Error:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Internal Server Error while toggling attendance" 
    });
  }
};
