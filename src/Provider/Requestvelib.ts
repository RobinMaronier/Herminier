import {Observable} from "rxjs/Observable";
import {ToastController} from "ionic-angular";
import {Http} from "@angular/http";
import {Injectable} from "@angular/core";
import 'rxjs/add/operator/map';

@Injectable()
export class Requestvelib {

  private baseUrl = 'https://opendata.paris.fr/api/records/1.0/search/';
  private dataset = 'dataset=stations-velib-disponibilites-en-temps-reel';

  constructor(public http: Http) {
  }

  private makeDataURL(coordX: number, coordY: number): string {
    let uri = this.baseUrl + '?' + this.dataset;
    uri += '&' + this.getLangRequest();
    uri += '&' + this.getNumberRowRequest();
    uri += '&' + this.getOnlyOpen(true);
    uri += '&' + this.filterWithPosition(coordX, coordY, 1000)
    return uri;
  }

  private filterWithPosition(coordX: number, coordY: number, distance: number): string {
    let geoFilter = 'geofilter.distance=' + String(coordX) + ',' + String(coordY) + ',' + String(distance);
    return geoFilter;
  }

  private getLangRequest(): string {
    let lang = 'lang=fr';
    return lang;
  }

  private getNumberRowRequest(): string {
    let numberOfRow = 'rows=90';
    return numberOfRow;
  }

  private getOnlyOpen(open: boolean): string {
    let onlyOpen = 'facet=status';
    if (open) {
      onlyOpen += '&refine.status=OPEN';
    } else {
      onlyOpen += '&refine.status=CLOSE';
    }
    return onlyOpen;
  }

  public getVelib(latlng): Observable<any> {
    let url: string = this.makeDataURL(latlng.lat, latlng.lng);
    console.log('voici l\'url = ', url);
    /*  var headers = new Headers();
      headers.append("Authorization", "Bearer " + token);
      headers.append('AppKey', this.AppKey);*/
    return this.http.get(url).map(res => res.json());
  }
}
