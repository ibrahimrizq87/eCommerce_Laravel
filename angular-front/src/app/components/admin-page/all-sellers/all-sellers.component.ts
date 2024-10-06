import { Component } from '@angular/core';
import { SellerService } from '../../../services/seller.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-all-sellers',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule],
  templateUrl: './all-sellers.component.html',
  styleUrl: './all-sellers.component.css'
})
export class AllSellersComponent {
  sellers: any[] | null[] = [];
  page: number = 1;
  itemsPerPage: number = 10;
  constructor(private sellerService: SellerService) { }

  ngOnInit(): void {
    this.updateSellers();
  }

  banUser(seller: any) {
    this.sellerService.banSeller(seller.id).subscribe(
      response => {
        this.updateSellers();
        alert('user banned successfully');
      }, error => {
      alert('some error happend');
      console.log('error happend', error);

    }
    );
  }
  updateSellers() {
    this.sellerService.getAllSellers().subscribe(response => {
      console.log(response);
      this.sellers = response.data;


    },
      error => {

        console.error('some error happend:', error);

      });
  }


}
