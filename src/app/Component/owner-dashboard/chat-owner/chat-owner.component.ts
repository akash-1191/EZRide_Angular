import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription, firstValueFrom } from 'rxjs';
import { ChatService, Conversation, Message } from '../../../services/services/chat.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/services/auth.service';

@Component({
  selector: 'app-chat-owner',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './chat-owner.component.html',
  styleUrls: ['./chat-owner.component.css']
})
export class ChatOwnerComponent implements OnInit, OnDestroy {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;

  // State
  conversations: Conversation[] = [];
  selectedConversation: Conversation | null = null;
  messages: Message[] = [];
  messageText = '';
  loading = false;
  isConnected = false;

  currentUserId: number = Number(sessionStorage.getItem('UserId')) || 0;
  currentUserName: string = sessionStorage.getItem('Name') || 'Owner';
  currentUserRole: string = sessionStorage.getItem('Role') || 'OwnerVehicle';
  
  // Subscriptions
  private subscriptions: Subscription[] = [];

  constructor(
    private chatService: ChatService,
    private auth: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    this.initializeSignalR();
    await this.loadConversations();
    this.setupSubscriptions();
  }

  // private async initializeSignalR(): Promise<void> {
  //   const token = this.auth.getToken();
  //   if (!token) {
  //     console.error(' No token found');
  //     return;
  //   }

  //   // Clean token (remove 'Bearer ' prefix)
  //   const cleanToken = token.replace('Bearer ', '');
    
  //   try {
  //     const connected = await this.chatService.startConnection(cleanToken);
  //     if (connected) {
  //       console.log(' SignalR initialized');
  //     }
  //   } catch (error) {
  //     console.error(' Failed to initialize SignalR:', error);
  //   }
  // }
  private async initializeSignalR(): Promise<void> {
  const token = sessionStorage.getItem('token');
  if (!token) {
    console.error('No token found');
    alert('Please login first!');
    return;
  }

  try {
    // Clean token for SignalR
    const cleanToken = token.replace('Bearer ', '');
    
    console.log('🔄 Starting SignalR connection...');
    
    // Start SignalR with retry
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        const connected = await this.chatService.startConnection(cleanToken);
        
        if (connected) {
          this.isConnected = true;
          console.log('✅ SignalR connected successfully');
          break;
        }
      } catch (error) {
        retryCount++;
        console.log(`🔄 Retry ${retryCount}/${maxRetries}...`);
        
        if (retryCount === maxRetries) {
          throw error;
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
      }
    }
    
    // Load conversations
    await this.loadConversations();
    
  } catch (error) {
    console.error('❌ Chat initialization failed:', error);
    this.isConnected = false;
    
    // Show user-friendly message
    alert('Unable to connect to chat service. Please refresh the page.');
  }
}


  isMyMessage(message: any): boolean {
  return message?.senderId === Number(sessionStorage.getItem('UserId'));
}
  private async loadConversations(): Promise<void> {
    try {
      this.loading = true;
      this.conversations = await firstValueFrom(
        this.chatService.getConversations()
      );
      
      // Auto-select first conversation if exists
      if (this.conversations.length > 0 && !this.selectedConversation) {
        await this.selectConversation(this.conversations[0]);
      }
    } catch (error) {
      console.error(' Error loading conversations:', error);
    } finally {
      this.loading = false;
    }
  }

  private setupSubscriptions(): void {
    // Connection status
    const connSub = this.chatService.connectionStatus$.subscribe(status => {
      this.isConnected = status;
    });

    // Real-time messages
    const msgSub = this.chatService.messages$.subscribe(event => {
      if (!event) return;

      switch (event.type) {
        case 'message':
          this.handleNewMessage(event.payload);
          break;
        case 'delivered':
          this.handleMessageDelivered(event.payload.conversationId);
          break;
        case 'read':
          this.handleMessageRead(event.payload.conversationId);
          break;
        case 'connected':
          console.log('SignalR connected event received');
          break;
      }
    });

    this.subscriptions.push(connSub, msgSub);
  }

  async selectConversation(conversation: Conversation): Promise<void> {
  if (this.selectedConversation?.conversationId === conversation.conversationId) {
    return;
  }

  // Leave previous conversation
  if (this.selectedConversation) {
    await this.chatService.leaveConversation(this.selectedConversation.conversationId);
  }

  this.selectedConversation = conversation;
  this.messages = [];
  
  try {
    // Small delay to ensure UI updates
    await new Promise(resolve => setTimeout(resolve, 50));
    
    // Check connection status
    if (!this.chatService.isConnected()) {
      console.log('🔄 Reconnecting SignalR...');
      const token = sessionStorage.getItem('token')?.replace('Bearer ', '') || '';
      await this.chatService.startConnection(token);
    }
    
    // Join SignalR group
    await this.chatService.joinConversation(conversation.conversationId);
    
    // Load messages
    await this.loadMessages();
    
    // Mark messages as read
    await this.markMessagesRead();
    
    // Scroll to bottom
    setTimeout(() => this.scrollToBottom(), 100);
    
  } catch (error) {
    console.error('Error selecting conversation:', error);
    // alert('Failed to join conversation. Please try again.');
  }
}


  private async loadMessages(): Promise<void> {
    if (!this.selectedConversation) return;

    try {
      const loadedMessages = await firstValueFrom(
        this.chatService.getMessages(this.selectedConversation.conversationId, 50)
      );
      
      // Process messages
      this.messages = loadedMessages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
        isSentByMe: msg.senderId === this.auth.getUserId()
      }));
      
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }

  async sendMessage(): Promise<void> {
    if (!this.messageText.trim() || !this.selectedConversation) {
      return;
    }

    const text = this.messageText.trim();
    this.messageText = '';

    try {
      await this.chatService.sendMessage(this.selectedConversation.conversationId, text);
      
      // Optimistically add message to UI (will be confirmed by SignalR)
      const tempMessage: Message = {
        messageId: 0, // Temporary ID
        conversationId: this.selectedConversation.conversationId,
        senderId: this.auth.getUserId(),
        senderName: 'You',
        senderRole: this.auth.getRole() || 'OwnerVehicle',
        messageText: text,
        timestamp: new Date(),
        status: 'Sending...',
        isSentByMe: true
      };
      
      this.messages.push(tempMessage);
      this.scrollToBottom();
      
    } catch (error) {
      console.error('Error sending message:', error);
      // Restore message text if failed
      this.messageText = text;
    }
  }

  private handleNewMessage(message: Message): void {
    // Convert timestamp
    message.timestamp = new Date(message.timestamp);
    message.isSentByMe = message.senderId === this.auth.getUserId();
    
    // Update or add message
    const existingIndex = this.messages.findIndex(m => m.messageId === message.messageId);
    
    if (existingIndex >= 0) {
      // Update existing message (e.g., status update)
      this.messages[existingIndex] = message;
    } else {
      // Add new message
      this.messages.push(message);
      
      // Update conversation last message
      if (this.selectedConversation?.conversationId === message.conversationId) {
        this.updateConversationLastMessage(message);
      }
    }
    
    this.scrollToBottom();
  }

  private handleMessageDelivered(conversationId: number): void {
    if (this.selectedConversation?.conversationId === conversationId) {
      this.messages.forEach(msg => {
        if (msg.status === 'Sent' && !msg.isSentByMe) {
          msg.status = 'Delivered';
        }
      });
    }
  }

  private handleMessageRead(conversationId: number): void {
    if (this.selectedConversation?.conversationId === conversationId) {
      this.messages.forEach(msg => {
        if (msg.status === 'Delivered' && !msg.isSentByMe) {
          msg.status = 'Read';
        }
      });
    }
  }

  private async markMessagesRead(): Promise<void> {
    if (!this.selectedConversation) return;
    
    try {
      await this.chatService.markAsRead(this.selectedConversation.conversationId);
      // Update local messages status
      this.messages.forEach(msg => {
        if (!msg.isSentByMe && msg.status !== 'Read') {
          msg.status = 'Read';
        }
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }

  private updateConversationLastMessage(message: Message): void {
    const conv = this.conversations.find(c => c.conversationId === message.conversationId);
    if (conv) {
      conv.lastMessage = message;
      conv.unreadCount = 0; // Reset unread count when viewing
    }
  }

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

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  ngOnDestroy(): void {
    // Unsubscribe from all observables
    this.subscriptions.forEach(sub => sub.unsubscribe());
    
    // Leave current conversation
    if (this.selectedConversation) {
      this.chatService.leaveConversation(this.selectedConversation.conversationId);
    }
    
    // Optional: Stop SignalR connection
    // this.chatService.stopConnection();
  }

  // Component mein ye method add karo
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