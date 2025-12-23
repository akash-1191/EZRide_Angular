import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

/* ================= INTERFACES ================= */

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

/* ================= SERVICE ================= */

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

  // ✅ SAME STRUCTURE AS YOUR OLD CODE (JUST ENV)
  private baseUrl = `${environment.apiBaseUrl}/Chat`;
private chathubUrl = `${environment.apiBaseUrl.replace('/api', '')}/chathub`;
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  /* ================= SIGNALR CONNECTION ================= */

   public async startConnection(token: string): Promise<boolean> {
    try {
      if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
        return true;
      }

      if (this.hubConnection) {
        await this.stopConnection();
      }

      const cleanToken = token?.replace('Bearer ', '') || '';

      this.hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(
          `${this.chathubUrl}`,
          {
            accessTokenFactory: () => cleanToken,
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets
          }
        )
        .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
        .configureLogging(signalR.LogLevel.Warning)
        .build();

      this.setupEventListeners();

      await this.hubConnection.start();
      this.connectionStatus.next(true);
      this.retryCount = 0;

      this.messagesSubject.next({ type: 'connected', payload: null });
      return true;

    } catch (error) {
      this.connectionStatus.next(false);

      if (this.retryCount < this.maxRetries) {
        this.retryCount++;
        setTimeout(() => this.startConnection(token), 3000);
      }
      return false;
    }
  }


  private setupEventListeners(): void {
    if (!this.hubConnection) return;

    this.hubConnection.on('ReceiveMessage', (payload: any) => {
      const myId = this.getCurrentUserId();

      this.messagesSubject.next({
        type: 'message',
        payload: {
          ...payload,
          timestamp: new Date(payload.timestamp),
          isSentByMe: payload.senderId === myId
        }
      });
    });

    this.hubConnection.on('MessagesDelivered', (conversationId: number) => {
      this.messagesSubject.next({
        type: 'delivered',
        payload: { conversationId }
      });
    });

    this.hubConnection.on('MessagesRead', (data: any) => {
      this.messagesSubject.next({
        type: 'read',
        payload: data
      });
    });

    this.hubConnection.onreconnecting(() => {
      this.connectionStatus.next(false);
    });

    this.hubConnection.onreconnected(() => {
      this.connectionStatus.next(true);
    });

    this.hubConnection.onclose(() => {
      this.connectionStatus.next(false);
    });
  }

  public async stopConnection(): Promise<void> {
    if (this.hubConnection) {
      await this.hubConnection.stop();
      this.hubConnection = null;
      this.connectionStatus.next(false);
    }
  }

  /* ================= SIGNALR ACTIONS ================= */

  public async waitForConnection(timeoutMs: number = 5000): Promise<boolean> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeoutMs) {
      if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return false;
  }

  public async joinConversation(conversationId: number): Promise<void> {
    if (!this.hubConnection || this.hubConnection.state !== signalR.HubConnectionState.Connected) {
      const connected = await this.waitForConnection(3000);
      if (!connected || !this.hubConnection) {
        throw new Error('Hub not connected');
      }
    }
    await this.hubConnection.invoke('JoinConversation', conversationId);
  }

  public async leaveConversation(conversationId: number): Promise<void> {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      await this.hubConnection.invoke('LeaveConversation', conversationId);
    }
  }

  public async sendMessage(conversationId: number, text: string): Promise<void> {
    if (!text.trim()) throw new Error('Message cannot be empty');
    await this.hubConnection!.invoke('SendMessage', conversationId, text.trim());
  }

  public async markAsRead(conversationId: number): Promise<void> {
    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      await this.hubConnection.invoke('MarkMessagesRead', conversationId);
    }
  }

  /* ================= HTTP API CALLS ================= */

  getConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(
      `${this.baseUrl}/conversations-with-users`,
      { headers: this.getAuthHeaders() }
    );
  }

  createConversation(participantId: number, type: string = 'AdminOwner'): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/conversation`,
      { participantId, type },
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

  getUsersByRole(role: string): Observable<any[]> {
    return this.http.get<any[]>(
      `${environment.apiBaseUrl}/Admin/users/${role}`,
      { headers: this.getAuthHeaders() }
    );
  }

  /* ================= HELPERS ================= */

  private getAuthHeaders(): HttpHeaders {
    let token = sessionStorage.getItem('token');
    if (token && !token.startsWith('Bearer ')) {
      token = 'Bearer ' + token;
    }
    return new HttpHeaders({
      Authorization: token || '',
      'Content-Type': 'application/json'
    });
  }

  /* ================= UTILITIES ================= */

  isConnected(): boolean {
    return this.hubConnection?.state === signalR.HubConnectionState.Connected;
  }

  getConnectionState(): string {
    return this.hubConnection?.state || 'Disconnected';
  }

  getCurrentUserId(): number {
    const userId = sessionStorage.getItem('UserId');
    return userId ? Number(userId) : 0;
  }

  formatMessageTime(timestamp: Date): string {
    const date = new Date(timestamp);
    const diffMins = Math.floor((Date.now() - date.getTime()) / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;

    return date.toLocaleDateString();
  }
}
