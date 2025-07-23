// @ts-nocheck
import { redirect } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const protectedRoutes = ['/profil', '/panier', '/produits/ajouter-arbre', '/reset-password'];

export async function handle({ event, resolve }) {
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!jwtSecret) {
        console.error('JWT_SECRET non défini dans les variables d\'environnement');
        throw new Error('Configuration JWT manquante');
    }
    
    const token = event.cookies.get('token') || 
        event.request.headers.get('Authorization')?.replace('Bearer ', '');
    
    const isProtectedRoute = protectedRoutes.some(route =>
        event.url.pathname.startsWith(route)
    );
    if (isProtectedRoute) {
        if (!token) {
            throw redirect(302, '/connexion');
        }
        try {
            const decoded = jwt.verify(token, jwtSecret);
            event.locals.user = decoded;
        } catch (error) {
            event.cookies.delete('token', { path: '/' });
        }
    }
    
    const response = await resolve(event);
    
    response.headers.set('Content-Security-Policy', 
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' https://js.stripe.com https://m.stripe.network https://tenor.com; " +
        "style-src 'self' 'unsafe-inline' https://m.stripe.network; " +
        `img-src 'self' data: blob: ${process.env.VITE_API_URL};` +
        `connect-src 'self' ${process.env.VITE_API_URL} https://api.stripe.com;` +
        "frame-src https://js.stripe.com https://m.stripe.network https://www.youtube-nocookie.com https://tenor.com; " +
        "child-src https://js.stripe.com https://m.stripe.network;"
    );
    
    return response;
}
