import { NgClass, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-hero-slider',
  imports: [NgFor, NgClass],
  templateUrl: './hero-slider.component.html',
  styleUrl: './hero-slider.component.css'
})
export class HeroSliderComponent implements OnInit {

  slides = [
    {
      image: 'assets/image/car.jpg',
      title: 'Drive in Style 🚗',
      description: 'Rent premium vehicles at unbeatable prices.',
    },
    {
      image: 'assets/image/car2.jpg',
      title: 'Adventure Awaits 🌄',
      description: 'Explore new places with our reliable rides.'
    },
    {
      image: 'assets/image/car3.jpg',
      title: 'Comfort Meets Convenience 🛣️',
      description: 'Your journey starts here, stress-free and smooth.'
    },
    {
      image: 'assets/image/car4.jpg',
      title: 'Comfort Meets Convenience 🛣️',
      description: 'Your journey starts here, stress-free and smooth.'
    },
    {
      image: 'assets/image/car5.jpg',
      title: 'Comfort Meets Convenience 🛣️',
      description: 'Your journey starts here, stress-free and smooth.'
    }
  ];


  currentIndex = 0;
  autoSlideInterval: any;

  ngOnInit(): void {
    this.startAutoSlide();
  }

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.slides.length;
    }, 5000);
  }

  goToSlide(index: number) {
    this.currentIndex = index;
    clearInterval(this.autoSlideInterval);
    this.startAutoSlide();
  }

  

}
