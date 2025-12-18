import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService, Conversation, Message } from '../../../services/services/chat.service';
import { firstValueFrom, Subscription } from 'rxjs';

@Component({
  selector: 'app-conversations',
  imports: [FormsModule,CommonModule],
  templateUrl: './conversations.component.html',
  styleUrl: './conversations.component.css'
})
export class ConversationsComponent implements  OnInit, OnDestroy {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  // State
  conversations: Conversation[] = [];
  selectedConversation: Conversation | null = null;
  messages: Message[] = [];
  messageText = '';
  loading = false;
  isConnected = false;
  
  // User selection
  selectedUserType: 'owner' | 'customer' | 'driver' = 'owner';
  selectedUserId: number | null = null;
  
  // Users lists
  owners: any[] = [];
  customers: any[] = [];
  drivers: any[] = [];

  // Current admin info
  currentUserId: number = Number(sessionStorage.getItem('UserId')) || 0;

  // Subscriptions
  private subscriptions: Subscription[] = [];

  constructor(private chatService: ChatService) {}

  async ngOnInit(): Promise<void> {
    await this.initializeChat();
  }

  private async initializeChat(): Promise<void> {
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error(' No token found');
      return;
    }

    try {
      // Start SignalR connection
      const cleanToken = token.replace('Bearer ', '');
      await this.chatService.startConnection(cleanToken);
      this.isConnected = this.chatService.isConnected();

      // Load conversations
      await this.loadConversations();

      // Load users for selection
      await this.loadUsers();

      // Setup real-time listeners
      this.setupSubscriptions();

    } catch (error) {
      console.error(' Chat initialization failed:', error);
    }
  }

  private async loadConversations(): Promise<void> {
    try {
      this.loading = true;
      this.conversations = await firstValueFrom(
        this.chatService.getConversations()
      );
      // console.log(' Loaded conversations:', this.conversations.length);
    } catch (error) {
      console.error(' Error loading conversations:', error);
    } finally {
      this.loading = false;
    }
  }

  private async loadUsers(): Promise<void> {
    try {
      // Load users for admin selection
      // You need to implement getUsersByRole in ChatService
      this.owners = await firstValueFrom(
        this.chatService.getUsersByRole('owner')
      );
      this.customers = await firstValueFrom(
        this.chatService.getUsersByRole('customer')
      );
      this.drivers = await firstValueFrom(
        this.chatService.getUsersByRole('driver')
      );
      
      // console.log(' Users loaded:', {
      //   owners: this.owners.length,
      //   customers: this.customers.length,
      //   drivers: this.drivers.length
      // });
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }

  private setupSubscriptions(): void {
    // Real-time messages
    const msgSub = this.chatService.messages$.subscribe(event => {
      if (!event) return;

      if (event.type === 'message') {
        this.handleNewMessage(event.payload);
      }
    });
const connSub = this.chatService.connectionStatus$.subscribe(status => {
  this.isConnected = status;
});

    this.subscriptions.push(msgSub);
  }

  // =============== USER SELECTION ===============
  
  onUserTypeChange(): void {
    this.selectedUserId = null;
    this.selectedConversation = null;
    this.messages = [];
  }

  async selectUser(userId: number): Promise<void> {
    this.selectedUserId = userId;
    
    try {
      // Check if conversation already exists with this user
      const existingConv = this.conversations.find(
        conv => conv.otherUserId === userId
      );
      
      if (existingConv) {
        await this.selectConversation(existingConv);
      } else {
        await this.createNewConversation(userId);
      }
    } catch (error) {
      console.error('Error selecting user:', error);
    }
  }

  private async createNewConversation(userId: number): Promise<void> {
    try {
      // Create conversation with selected user
      const convType = this.getConversationType();
      const response: any = await firstValueFrom(
        this.chatService.createConversation(userId, convType)
      );

      if (response?.conversationId) {
        const newConversation: Conversation = {
          conversationId: response.conversationId,
          otherUserId: userId,
          otherUserName: this.getUserName(userId),
          otherUserRole: this.selectedUserType.toUpperCase(),
          unreadCount: 0,
          createdAt: new Date()
        };

        this.conversations.unshift(newConversation);
        await this.selectConversation(newConversation);
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      alert('Failed to start conversation. Please try again.');
    }
  }

  // =============== CONVERSATION MANAGEMENT ===============
  
  async selectConversation(conversation: Conversation): Promise<void> {
    if (this.selectedConversation?.conversationId === conversation.conversationId) {
      return;
    }

    // Leave previous conversation
    if (this.selectedConversation) {
      await this.chatService.leaveConversation(this.selectedConversation.conversationId);
    }

    this.selectedConversation = conversation;
    this.selectedUserId = conversation.otherUserId;
    this.messages = [];
    
    try {
      // Join SignalR group
      await this.chatService.joinConversation(conversation.conversationId);
      
      // Load messages
      await this.loadMessages();
      
      // Mark messages as read
      await this.markMessagesRead();
      conversation.unreadCount = 0;
      
      // Scroll to bottom
      setTimeout(() => this.scrollToBottom(), 100);
      
    } catch (error) {
      console.error('Error selecting conversation:', error);
    }
  }

  private async loadMessages(): Promise<void> {
    if (!this.selectedConversation) return;

    try {
      const loadedMessages = await firstValueFrom(
        this.chatService.getMessages(this.selectedConversation.conversationId, 50)
      );
      
      this.messages = loadedMessages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
        isSentByMe: msg.senderId === this.currentUserId
      }));
      
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }

  // =============== MESSAGING ===============
  
 async sendMessage(): Promise<void> {
  if (!this.messageText.trim() || !this.selectedConversation) {
    return;
  }

  const text = this.messageText.trim();
  this.messageText = '';

  try {
    await this.chatService.sendMessage(
      this.selectedConversation.conversationId,
      text
    );
  } catch (error) {
    console.error('Error sending message:', error);
    this.messageText = text; // restore on failure
  }
}


  private handleNewMessage(message: Message): void {
  if (!message) return;

  message.timestamp = new Date(message.timestamp);
  message.isSentByMe = message.senderId === this.currentUserId;

  // 1️⃣ Update message list (if current conversation)
  if (this.selectedConversation?.conversationId === message.conversationId) {
    const existingIndex = this.messages.findIndex(
      m => m.messageId === message.messageId
    );

    if (existingIndex >= 0) {
      this.messages[existingIndex] = message;
    } else {
      this.messages.push(message);
    }

    this.scrollToBottom();
    this.markMessagesRead();
  }

  // 2️⃣ Update conversation list
  const conv = this.conversations.find(
    c => c.conversationId === message.conversationId
  );

  if (conv) {
    conv.lastMessage = message;

    if (!this.selectedConversation ||
        this.selectedConversation.conversationId !== message.conversationId) {
      conv.unreadCount += 1;
    }

    // Move conversation to top
    this.conversations = [
      conv,
      ...this.conversations.filter(c => c.conversationId !== conv.conversationId)
    ];
  }
}


  private async markMessagesRead(): Promise<void> {
    if (!this.selectedConversation) return;
    
    try {
      await this.chatService.markAsRead(this.selectedConversation.conversationId);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }

  // =============== UTILITIES ===============
  
  private getConversationType(): string {
    switch (this.selectedUserType) {
      case 'owner': return 'AdminOwner';
      case 'customer': return 'AdminOwner'; // Use existing type
      case 'driver': return 'AdminDriver';
      default: return 'AdminOwner';
    }
  }

  private getUserName(userId: number): string {
    let userList: any[] = [];
    
    switch (this.selectedUserType) {
      case 'owner': userList = this.owners; break;
      case 'customer': userList = this.customers; break;
      case 'driver': userList = this.drivers; break;
    }
    
    const user = userList.find(u => u.userId === userId);
    return user?.fullName || user?.name || `User ${userId}`;
  }

  getCurrentUserList(): any[] {
    switch (this.selectedUserType) {
      case 'owner': return this.owners;
      case 'customer': return this.customers;
      case 'driver': return this.drivers;
      default: return [];
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.messageContainer?.nativeElement) {
        const container = this.messageContainer.nativeElement;
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }

  formatTime(date: Date): string {
    if (!date) return '';
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  // =============== CLEANUP ===============
  
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    
    if (this.selectedConversation) {
      this.chatService.leaveConversation(this.selectedConversation.conversationId);
    }
  }
}
