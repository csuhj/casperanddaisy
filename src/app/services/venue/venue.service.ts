import { Injectable } from '@angular/core';
import { Venue } from '../../models/venue/venue';
import { map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IVenues } from '../../api-interface/venues/venues.interface';

@Injectable({
  providedIn: 'root'
})
export class VenueService {

  constructor(private http: HttpClient) { 
  }

  public getVenues() {
    return this.http.get<IVenues>("./assets/venues.json")
    .pipe(
      map((venues) => venues?.venues?.map(v => {
        return new Venue({
          city: v.city,
          stadium: v.stadium
        });
      }) ?? []
    ));
  }
}
