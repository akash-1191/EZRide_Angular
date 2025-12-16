import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface Message {
  messageId: number;
  conversationId: number;
  senderId: number;
  senderName: string;
  senderRole: string;
  messageText: string;
  timestamp: Date;
  status: string;
  isSentByMe?: boolean;
}

export interface Conversation {
  conversationId: number;
  otherUserId: number;
  otherUserName: string;
  otherUserEmail?: string;
  otherUserRole: string;
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
}

export interface SignalREvent {
  type: 'message' | 'delivered' | 'read' | 'connected' | 'error';
  payload?: any;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private hubConnection: signalR.HubConnection | null = null;
  private messagesSubject = new BehaviorSubject<SignalREvent | null>(null);
  private connectionStatus = new BehaviorSubject<boolean>(false);
  private retryCount = 0;
  private maxRetries = 5;
  
  messages$ = this.messagesSubject.asObservable();
  connectionStatus$ = this.connectionStatus.asObservable();

  private baseUrl = 'http://localhost:7188/api/Chat';

  constructor(private http: HttpClient) {}

  // ================= PRIVATE HELPER =================
  private getAuthHeaders(): HttpHeaders {
    let token = sessionStorage.getItem('token');
      if (token && !token.startsWith('Bearer ')) {
    token = 'Bearer ' + token;
  }
  
  if (!token) {
    console.error(' NO TOKEN FOUND! User might be logged out.');
  }

    return new HttpHeaders({
    'Authorization': token || '',
    'Content-Type': 'application/json'
  });
}

  // ================= SIGNALR CONNECTION =================
  public async startConnection(token: string): Promise<boolean> {
    try {
      if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
        return true;
      }

      // Stop existing connection if any
      if (this.hubConnection) {
        await this.stopConnection();
      }

      console.log('Starting SignalR connection...');
      
      // Clean token (remove Bearer prefix if present for SignalR)
      const cleanToken = token?.replace('Bearer ', '') || '';
      
      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(`${this.baseUrl.replace('/api/Chat', '')}/chathub`, {
          accessTokenFactory: () => cleanToken,
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets
        })
        .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
        .configureLogging(signalR.LogLevel.Warning)
        .build();

      this.setupEventListeners();
      
      await this.hubConnection.start();
      this.connectionStatus.next(true);
      this.retryCount = 0;
      console.log('SignalR Connected!');
      
      this.messagesSubject.next({ type: 'connected', payload: null });
      return true;
      
    } catch (error) {
      console.error(' SignalR Connection Error:', error);
      this.connectionStatus.next(false);
      
      // Auto-retry logic
      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        console.log(`Retrying connection (${this.retryCount}/${this.maxRetries})...`);
        setTimeout(() => this.startConnection(token), 3000);
      }
      return false;
    }
  }

  private setupEventListeners(): void {
    if (!this.hubConnection) return;

    // Message received
    this.hubConnection.on('ReceiveMessage', (payload: any) => {
      // console.log(' New message received:', payload);
      this.messagesSubject.next({ 
        type: 'message', 
        payload: {
          ...payload,
          timestamp: new Date(payload.timestamp)
        }
      });
    });

    // Message delivered
    this.hubConnection.on('MessagesDelivered', (conversationId: number) => {
      // console.log(' Messages delivered for conversation:', conversationId);
      this.messagesSubject.next({ 
        type: 'delivered', 
        payload: { conversationId }
      });
    });

    // Message read
    this.hubConnection.on('MessagesRead', (data: any) => {
      // console.log(' Messages read:', data);
      this.messagesSubject.next({ 
        type: 'read', 
        payload: data 
      });
    });

    // Additional events from Hub
    this.hubConnection.on('MessageSent', (data: any) => {
      // console.log(' Message sent confirmation:', data);
      this.messagesSubject.next({
        type: 'message',
        payload: data
      });
    });

    // Reconnection events
    this.hubConnection.onreconnecting((error) => {
      console.log(' SignalR Reconnecting...', error);
      this.connectionStatus.next(false);
    });

    this.hubConnection.onreconnected((connectionId) => {
      console.log(' SignalR Reconnected:', connectionId);
      this.connectionStatus.next(true);
    });

    this.hubConnection.onclose((error) => {
      console.log(' SignalR Connection Closed', error);
      this.connectionStatus.next(false);
    });
  }

  public async stopConnection(): Promise<void> {
    try {
      if (this.hubConnection) {
        await this.hubConnection.stop();
        this.hubConnection = null;
        this.connectionStatus.next(false);
        console.log('SignalR connection stopped');
      }
    } catch (error) {
      console.error('Error stopping connection:', error);
    }
  }

  // ================= SIGNALR ACTIONS =================


public async waitForConnection(timeoutMs: number = 5000): Promise<boolean> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeoutMs) {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.error(' Connection timeout after', timeoutMs, 'ms');
  return false;
}
  


  // public async joinConversation(conversationId: number): Promise<void> {
  //   try {
  //     if (!this.hubConnection || this.hubConnection.state !== signalR.HubConnectionState.Connected) {
  //       throw new Error('Hub not connected');
  //     }
      
  //     await this.hubConnection.invoke('JoinConversation', conversationId);
  //     console.log(`Joined conversation: ${conversationId}`);
  //   } catch (error) {
  //     console.error('Error joining conversation:', error);
  //     throw error;
  //   }
  // }

 public async joinConversation(conversationId: number): Promise<void> {
  try {
    // Wait for connection if not connected
    if (!this.hubConnection || this.hubConnection.state !== signalR.HubConnectionState.Connected) {
      // console.log(' Waiting for SignalR connection...');
      const connected = await this.waitForConnection(3000);
      
      if (!connected || !this.hubConnection) {
        throw new Error('Hub not connected after waiting');
      }
    }
    
    //  ADD NULL CHECK HERE
    if (!this.hubConnection) {
      throw new Error('Hub connection is null');
    }
    
    await this.hubConnection.invoke('JoinConversation', conversationId);
    // console.log(` Joined conversation: ${conversationId}`);
    
  } catch (error: any) { //  FIX: Add type annotation
    console.error(' Error joining conversation:', error);
    const errorMessage = error?.message || error?.toString() || '';
    if (errorMessage.includes('not connected') || errorMessage.includes('Hub not connected')) {
      const token = sessionStorage.getItem('token')?.replace('Bearer ', '');
      if (token) {
        await this.startConnection(token);
        if (this.hubConnection) {
          await this.hubConnection.invoke('JoinConversation', conversationId);
        }
      }
    } else {
      throw error;
    }
  }
}

  public async leaveConversation(conversationId: number): Promise<void> {
    try {
      if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
        await this.hubConnection.invoke('LeaveConversation', conversationId);
        console.log(`Left conversation: ${conversationId}`);
      }
    } catch (error) {
      console.error('Error leaving conversation:', error);
    }
  }

  public async sendMessage(conversationId: number, text: string): Promise<void> {
    try {
      if (!this.hubConnection || this.hubConnection.state !== signalR.HubConnectionState.Connected) {
        throw new Error('Hub not connected');
      }
      
      if (!text.trim()) {
        throw new Error('Message cannot be empty');
      }

      await this.hubConnection.invoke('SendMessage', conversationId, text.trim());
      console.log(`Message sent to conversation: ${conversationId}`);
      
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  public async markAsRead(conversationId: number): Promise<void> {
    try {
      if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
        await this.hubConnection.invoke('MarkMessagesRead', conversationId);
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  }

  // ================= HTTP API CALLS =================
  getConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(
      `${this.baseUrl}/conversations-with-users`,
      { headers: this.getAuthHeaders() }
    );
  }

  createConversation(participantId: number, type: string = 'AdminOwner'): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/conversation`, 
      { 
        participantId, 
        type 
      },
      { headers: this.getAuthHeaders() }
    );
  }

  getMessages(conversationId: number, take: number = 100): Observable<Message[]> {
    return this.http.get<Message[]>(
      `${this.baseUrl}/${conversationId}/messages`,
      {
        headers: this.getAuthHeaders(),
        params: { take: take.toString() }
      }
    );
  }

  markMessagesRead(conversationId: number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/${conversationId}/mark-read`, 
      {},
      { headers: this.getAuthHeaders() }
    );
  }

  getUnreadCount(): Observable<{ unreadCount: number }> {
    return this.http.get<{ unreadCount: number }>(
      `${this.baseUrl}/unread-count`,
      { headers: this.getAuthHeaders() }
    );
  }

  // ================= UTILITIES =================
  isConnected(): boolean {
    return this.hubConnection?.state === signalR.HubConnectionState.Connected;
  }

  getConnectionState(): string {
    return this.hubConnection?.state || 'Disconnected';
  }

  // Get user ID from token (for local use)
  getCurrentUserId(): number {
    const userId = sessionStorage.getItem('UserId');
    return userId ? parseInt(userId, 10) : 0;
  }

  // Format date for display
  formatMessageTime(timestamp: Date): string {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    
    return date.toLocaleDateString();
  }


getUsersByRole(role: string): Observable<any[]> {
  const headers = this.getAuthHeaders(); 
  return this.http.get<any[]>(
    `http://localhost:7188/api/Admin/users/${role}`,
    { headers }
  );
}

}