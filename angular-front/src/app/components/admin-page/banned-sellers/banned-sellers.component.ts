import { Component } from '@angular/core';
import { SellerService } from '../../../services/seller.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-banned-sellers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './banned-sellers.component.html',
  styleUrl: './banned-sellers.component.css'
})
export class BannedSellersComponent {
  sellers:any [] |null [] =[];
  constructor(private sellerService: SellerService ) { }
  ngOnInit(): void {
    this.updateSellers();
    }

    activate(seller:any){
      this.sellerService.unBanSeller(seller.id).subscribe(
        response=>{
          this.updateSellers();
alert('user Activated successfully');
        },error=>
          {
            alert('some error happend');
            console.log('error happend',error);

          }
      );
    }
    updateSellers(){
      this.sellerService.getAllBannedSellers().subscribe(response => {
        console.log(response);
        this.sellers = response.data;
  
    
      },
      error => {
        
        console.error('some error happend:', error);
    
      });
    }


}
