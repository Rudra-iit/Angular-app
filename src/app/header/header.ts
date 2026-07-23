import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class HeaderComponent {
  @Input() searchValue = '';
  @Output() searchValueChange = new EventEmitter<string>();
  @Output() searchSubmitted = new EventEmitter<Event>();

  protected onSearchSubmit(event: Event): void {
    event.preventDefault();
    this.searchSubmitted.emit(event);
  }

  protected onSearchInput(value: string): void {
    this.searchValueChange.emit(value);
  }
}
