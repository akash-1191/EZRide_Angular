import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  getToken(): string | null {
  let token = sessionStorage.getItem('token');
  console.log(' Retrieved token:', token);
  
  // Agar token hai but Bearer prefix nahi hai to add karo
  if (token && !token.startsWith('Bearer ')) {
    token = 'Bearer ' + token;
    sessionStorage.setItem('token', token); // Update storage
  }
  
  return token;
}

 // Ya fir separate method:
getTokenForSignalR(): string {
  const token = this.getToken();
  // SignalR ko raw token chahiye (Bearer prefix ke bina)
  return token?.replace('Bearer ', '') || '';
}


  getRole(): string | null {
    return sessionStorage.getItem('Role');
  }

  getUserId(): number {
    const id = sessionStorage.getItem('UserId');
    return id ? Number(id) : 0;
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('token');
  }

  logout() {
    sessionStorage.clear();
  }
}
