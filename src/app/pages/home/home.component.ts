import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  showArrowUp: boolean = false;

  // Using HostListener to show Scroll Arrow
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const yOffset =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    this.showArrowUp = yOffset > 300;
  }

  ngOnInit(): void {
    // Using addEventListener to Scroll To Top
    // window.addEventListener('scroll', this.onScroll, true);
  }

  ngOnDestroy() {
    // window.removeEventListener('scroll', this.onScroll, true);
  }

  // Method to Scroll Up
  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Using addEventListener to show Scroll Arrow
  // onScroll = () => {
  //   const yOffset =
  //     window.pageYOffset || document.documentElement.scrollTop || 0;
  //   this.showArrowUp = yOffset > 300;
  // };
}
