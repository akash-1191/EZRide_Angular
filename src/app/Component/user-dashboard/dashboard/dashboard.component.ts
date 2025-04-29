import { Component, inject, Inject, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileComponent } from "../profile/profile.component";

@Component({
  selector: 'app-dashboard',
  imports: [ProfileComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {


  activeButtonId: string = '';

  constructor() { }

  ngOnInit(): void {
    const activeButtonId = localStorage.getItem('activeButtonId');
    if (activeButtonId) {
      this.activeButtonId = activeButtonId;
      this.showContent('content' + activeButtonId.slice(-1), activeButtonId);
    } else {
      this.showContent('content1', 'btn1');
    }
  }
  showContent(contentId: string, buttonId: string): void {
    // Set active button
    this.activeButtonId = buttonId;

    // Hide all content sections
    const contentDivs = document.getElementsByClassName('content') as HTMLCollectionOf<HTMLElement>;
    for (let i = 0; i < contentDivs.length; i++) {
      contentDivs[i].classList.add('hidden');
    }
    // Show the selected content
    const selectedContent = document.getElementById(contentId) as HTMLElement;
    if (selectedContent) {
      selectedContent.classList.remove('hidden');
    }
    // Store the active buttonId in localStorage
    localStorage.setItem('activeButtonId', buttonId);
  }
}
