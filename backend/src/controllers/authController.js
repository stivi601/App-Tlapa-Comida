const prisma = require('../utils/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_development_key';

/**
 * Registrar nuevo usuario
 */
const register = async (req, res) => {
    try {
        const { email, password, name, phone } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({
                error: 'Email, contraseña y nombre son requeridos'
            });
        }

        const existingEmail = await prisma.user.findUnique({
            where: { email }
        });

        if (existingEmail) {
            return res.status(400).json({
                error: 'Este correo electrónico ya está registrado'
            });
        }

        if (phone) {
            const existingPhone = await prisma.user.findFirst({
                where: { phone }
            });

            if (existingPhone) {
                return res.status(400).json({
                    error: 'Este número de teléfono ya está registrado'
                });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                phone: phone || null,
                role: 'CUSTOMER'
            },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                role: true,
                createdAt: true
            }
        });

        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            user,
            token
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
};

/**
 * Login de usuario
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: 'Email y contraseña son requeridos'
            });
        }

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({
                error: 'Credenciales inválidas'
            });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({
                error: 'Credenciales inválidas'
            });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        const { password: _, ...userWithoutPassword } = user;

        res.json({
            message: 'Login exitoso',
            user: userWithoutPassword,
            token
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};

/**
 * Obtener perfil del usuario autenticado
 */
const getProfile = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                image: true,
                role: true,
                createdAt: true,
                addresses: true
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({ error: 'Error al obtener perfil' });
    }
};

/**
 * Login de Admin
 */
const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                error: 'Usuario y contraseña son requeridos'
            });
        }

        const admin = await prisma.user.findFirst({
            where: {
                OR: [
                    { username },
                    { email: username }
                ],
                role: 'ADMIN'
            }
        });

        if (!admin) {
            return res.status(401).json({
                error: 'Usuario administrador no encontrado'
            });
        }

        const isValidPassword = await bcrypt.compare(password, admin.password);

        if (!isValidPassword) {
            return res.status(401).json({
                error: 'Contraseña de administrador incorrecta'
            });
        }

        const token = jwt.sign(
            { userId: admin.id, username: admin.username, role: 'ADMIN' },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        const { password: _, ...adminWithoutPassword } = admin;

        res.json({
            message: 'Login exitoso',
            user: adminWithoutPassword,
            token
        });
    } catch (error) {
        console.error('Error en admin login:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};

/**
 * Login de Restaurante
 */
const restaurantLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                error: 'Usuario y contraseña son requeridos'
            });
        }

        const restaurant = await prisma.restaurant.findFirst({
            where: { username }
        });

        if (!restaurant) {
            return res.status(401).json({
                error: 'Credenciales inválidas'
            });
        }

        const isValidPassword = await bcrypt.compare(password, restaurant.password);

        if (!isValidPassword) {
            return res.status(401).json({
                error: 'Credenciales inválidas'
            });
        }

        const token = jwt.sign(
            {
                userId: restaurant.id,
                restaurantId: restaurant.id,
                role: 'RESTAURANT'
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        const { password: _, ...restaurantWithoutPassword } = restaurant;

        res.json({
            message: 'Login exitoso',
            restaurant: restaurantWithoutPassword,
            token
        });
    } catch (error) {
        console.error('Error en restaurant login:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};

/**
 * Actualizar perfil de usuario
 */
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name, phone, email, password, image } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (phone) updateData.phone = phone;
        if (image) updateData.image = image;

        if (email) {
            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser && existingUser.id !== userId) {
                return res.status(400).json({ error: 'El email ya está en uso' });
            }
            updateData.email = email;
        }

        if (password) {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,
                email: true,
                name: true,
                phone: true,
                image: true,
                role: true,
                createdAt: true,
                addresses: true
            }
        });

        res.json(updatedUser);
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({ error: 'Error al actualizar perfil' });
    }
};

module.exports = {
    register,
    login,
    getProfile,
    adminLogin,
    restaurantLogin,
    updateProfile
};
