import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavigationComponent } from './components/navigation/navigation.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
  imports: [
    RouterOutlet,
    NavigationComponent,
    FooterComponent
  ]
})
export class App { }
