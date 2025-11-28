import { NextResponse } from 'next/server'

export async function POST() {
  // En un sistema JWT stateless, el logout es manejado en el cliente
  // (eliminando el token del localStorage)
  // Aquí solo confirmamos la acción
  
  return NextResponse.json({
    success: true,
    message: 'Logged out successfully'
  })
}