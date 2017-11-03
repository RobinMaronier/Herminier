import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import * as Leaflet from 'leaflet';
import {Requestvelib} from "../../Provider/Requestvelib";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  map: Leaflet.Map;
  center: L.PointTuple;
  datalist: any;


  truc: number = 1000;

  constructor(public navCtrl: NavController, public request: Requestvelib) {
  }

  ngOnInit() {
        this.drawMap();
      }

  private velibRequest(latlng, that): void {
    that.request.getVelib(latlng).subscribe(
      response => {
        that.datalist = response.records;
        //console.log('voici la data = ', response);
        that.setMarkers(response.records, that);
        console.log('datalist', that.datalist);
      },
      error => {
        console.log('bonjour l\'erreur', error.content.body);
      }
    )
  }

  private setMarkers(data, that): void {
    let icon = Leaflet.icon({
      iconUrl: 'assets/imgs/bike.png',
      iconSize: [25, 25]
    });
    for (let i of data) {
      let tab = {lat: i.geometry.coordinates[1], lng: i.geometry.coordinates[0]};
      Leaflet.marker(tab, {icon: icon}).addTo(that.map).bindPopup(i.fields.name + '<br/>Vélib disponible : ' + i.fields.available_bikes + '<br/>Place disponible : ' + i.fields.available_bike_stands);
    }
  }

  private removeAllLayers(that): void {
    that.map.eachLayer(function (layer) {
      if (layer instanceof Leaflet.marker) {
        layer.remove();
      }
    });
  }

  private drawMap(): void {
    this.map = Leaflet.map('map');
    Leaflet.tileLayer('https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicGF0cmlja3IiLCJhIjoiY2l2aW9lcXlvMDFqdTJvbGI2eXUwc2VjYSJ9.trTzsdDXD2lMJpTfCVsVuA', {
      maxZoom: 18
    }).addTo(this.map);
    let circle: Leaflet.Circle = Leaflet.circle([0, 0], {radius: 1000}).addTo(this.map);
    let marker: Leaflet.Marker = Leaflet.marker([0, 0]).addTo(this.map);
    //web location
    this.map.locate({setView: true, watch: true});

    let thisMap = this.map;
    let velibRequest = this.velibRequest;
    let that = this;

    function onLocationFound(e) {
      that.removeAllLayers(that);
      marker.remove();
      marker.setLatLng(e.latlng).addTo(thisMap).bindPopup('Toutes les stations velib à 1km de ma position');
      circle.remove();
      circle.setLatLng(e.latlng).addTo(thisMap);
      velibRequest(e.latlng, that);
    }
    this.map.on('locationfound', onLocationFound);

    function onLocationError(e) {
      alert('Impossible de récupérer votre position. Veuillez autoriser cette permission dans les paramètres de votre application.');
    }
    this.map.on('locationerror', onLocationError);
  }
}
