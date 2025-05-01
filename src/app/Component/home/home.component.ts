import { Component} from '@angular/core';
import { HeroSliderComponent } from "../hero-slider/hero-slider.component";

@Component({
  selector: 'app-home',
  imports: [HeroSliderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent  {

}
