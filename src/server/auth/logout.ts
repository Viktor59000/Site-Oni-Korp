// GET /api/auth/logout
import type { APIRoute } from 'astro';
import { clearSession } from '../session';

export const GET: APIRoute = ({ cookies, redirect }) => { clearSession(cookies); return redirect('/'); };
