import { Component } from '@angular/core';
import { SellerService } from '../../../services/seller.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-all-sellers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-sellers.component.html',
  styleUrl: './all-sellers.component.css'
})
export class AllSellersComponent {
  sellers:any [] |null [] =[];
  constructor(private sellerService: SellerService ) { }

  ngOnInit(): void {
    this.updateSellers();
    }

    banUser(seller:any){
      this.sellerService.banSeller(seller.id).subscribe(
        response=>{
          this.updateSellers();
alert('user banned successfully');
        },error=>
          {
            alert('some error happend');
            console.log('error happend',error);

          }
      );
    }
    updateSellers(){
      this.sellerService.getAllSellers().subscribe(response => {
        console.log(response);
        this.sellers = response.data;
  
    
      },
      error => {
        
        console.error('some error happend:', error);
    
      });
    }


}
