
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'odoodo_secret_2024';

export const signup = async (req, res) => {
  try {
    const { email, password, name, employeeId, role } = req.body;

    // 1. Validation
    if (!email || !password || !name || !employeeId) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    if (!email.endsWith('@odoodo.com')) {
      return res.status(400).json({ 
        success: false, 
        error: "Registration restricted to @odoodo.com corporate emails only." 
      });
    }

    // 2. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Database Operation
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        employeeId,
        role: role || "EMPLOYEE",
        status: "Active",
        joiningDate: new Date().toISOString().split('T')[0]
      }
    });

    const { password: _, ...userWithoutPassword } = user;

    return res.status(201).json({ 
      success: true, 
      message: "Account provisioned successfully", 
      data: userWithoutPassword 
    });

  } catch (error) {
    console.error("Signup Controller Error:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Internal Server Error during registration" 
    });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required" });
    }

    // 2. Find & Verify User
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    // 3. Generate Token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({ 
      success: true, 
      message: "Welcome back to Dayflow",
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          role: user.role
        }
      }
    });

  } catch (error) {
    console.error("Signin Controller Error:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Internal Server Error during signin" 
    });
  }
};
