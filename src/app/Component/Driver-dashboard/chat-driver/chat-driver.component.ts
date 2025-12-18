import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChatService, Conversation, Message } from '../../../services/services/chat.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { AuthService } from '../../../services/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-chat-driver',
  imports: [FormsModule,CommonModule],
  templateUrl: './chat-driver.component.html',
  styleUrl: './chat-driver.component.css'
})
export class ChatDriverComponent implements OnInit, OnDestroy {

  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  // ================= STATE =================
  conversations: Conversation[] = [];
  selectedConversation: Conversation | null = null;
  messages: Message[] = [];
  messageText = '';
  loading = false;
  isConnected = false;

  currentUserId!: number;
  currentUserName = sessionStorage.getItem('Name') || 'Driver';
  currentUserRole = sessionStorage.getItem('Role') || 'Driver';

  private subscriptions: Subscription[] = [];

  constructor(
    private chatService: ChatService,
    private auth: AuthService
  ) {}

  // ================= INIT =================
  async ngOnInit(): Promise<void> {
    this.currentUserId = this.auth.getUserId();
    await this.initChat();
    this.setupSubscriptions();
  }

  private async initChat(): Promise<void> {
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert('Please login again');
      return;
    }

    try {
      const cleanToken = token.replace('Bearer ', '');
      await this.chatService.startConnection(cleanToken);
      this.isConnected = this.chatService.isConnected();
      await this.loadConversations();
    } catch (error) {
      console.error('Driver chat init failed', error);
    }
  }

  // ================= LOAD =================
  private async loadConversations(): Promise<void> {
    try {
      this.loading = true;
      this.conversations = await firstValueFrom(
        this.chatService.getConversations()
      );

      if (this.conversations.length > 0) {
        await this.selectConversation(this.conversations[0]);
      }
    } catch (error) {
      console.error('Error loading conversations', error);
    } finally {
      this.loading = false;
    }
  }

  private async loadMessages(): Promise<void> {
    if (!this.selectedConversation) return;

    try {
      const msgs = await firstValueFrom(
        this.chatService.getMessages(this.selectedConversation.conversationId, 50)
      );

      this.messages = msgs.map(m => ({
        ...m,
        timestamp: new Date(m.timestamp),
        isSentByMe: m.senderId === this.currentUserId
      }));

      this.scrollToBottom();
    } catch (error) {
      console.error('Error loading messages', error);
    }
  }

  // ================= SUBSCRIPTIONS =================
  private setupSubscriptions(): void {

    const connSub = this.chatService.connectionStatus$.subscribe(status => {
      this.isConnected = status;
    });

    const msgSub = this.chatService.messages$.subscribe(event => {
      if (!event) return;

      if (event.type === 'message') {
        this.handleNewMessage(event.payload);
      }
    });

    this.subscriptions.push(connSub, msgSub);
  }

  // ================= CHAT =================
  async selectConversation(conv: Conversation): Promise<void> {
    if (this.selectedConversation?.conversationId === conv.conversationId) return;

    if (this.selectedConversation) {
      await this.chatService.leaveConversation(this.selectedConversation.conversationId);
    }

    this.selectedConversation = conv;
    this.messages = [];

    try {
      await this.chatService.joinConversation(conv.conversationId);
      await this.loadMessages();
      await this.markMessagesRead();

      // ✅ reset unread count
      conv.unreadCount = 0;

    } catch (error) {
      console.error('Select conversation error', error);
    }
  }

  async sendMessage(): Promise<void> {
    if (!this.messageText.trim() || !this.selectedConversation) return;

    const text = this.messageText.trim();
    this.messageText = '';

    try {
      await this.chatService.sendMessage(
        this.selectedConversation.conversationId,
        text
      );
    } catch (error) {
      console.error('Send message failed', error);
      this.messageText = text;
    }
  }

  private handleNewMessage(message: Message): void {
    message.timestamp = new Date(message.timestamp);
    message.isSentByMe = message.senderId === this.currentUserId;

    // Active chat
    if (this.selectedConversation?.conversationId === message.conversationId) {
      this.messages.push(message);
      this.scrollToBottom();
      this.markMessagesRead();
    }

    // Conversation list update
    const conv = this.conversations.find(c => c.conversationId === message.conversationId);
    if (conv) {
      conv.lastMessage = message;

      if (!this.selectedConversation ||
          this.selectedConversation.conversationId !== message.conversationId) {
        conv.unreadCount++;
      }
    }
  }

  private async markMessagesRead(): Promise<void> {
    if (!this.selectedConversation) return;

    try {
      await this.chatService.markAsRead(this.selectedConversation.conversationId);
    } catch {}
  }

  // ================= UI =================
  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.messageContainer) {
        this.messageContainer.nativeElement.scrollTop =
          this.messageContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // ================= DESTROY =================
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());

    if (this.selectedConversation) {
      this.chatService.leaveConversation(this.selectedConversation.conversationId);
    }
  }

  async reconnect(): Promise<void> {
  if (this.isConnected) return;
  
  console.log('🔄 Manual reconnect triggered');
  
  try {
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert('Please login again');
      return;
    }
    
    const cleanToken = token.replace('Bearer ', '');
    const connected = await this.chatService.startConnection(cleanToken);
    
    if (connected) {
      this.isConnected = true;
      alert('Reconnected successfully!');
      
      // Re-join current conversation if any
      if (this.selectedConversation) {
        await this.chatService.joinConversation(this.selectedConversation.conversationId);
      }
    }
  } catch (error) {
    console.error('❌ Reconnect failed:', error);
    alert('Reconnect failed. Please refresh the page.');
  }
}
}