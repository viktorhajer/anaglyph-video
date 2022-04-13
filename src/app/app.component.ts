import {Component, OnInit} from '@angular/core';
import {VideoService} from './services/video.service';
import {CanvasService} from './services/canvas.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  ready = false;
  devices: { index: number, label: string }[] = [];
  initialized = false;
  cameraLeftIndex = 0;
  cameraRightIndex = 0;

  constructor(private readonly videoService: VideoService,
              public readonly canvasService: CanvasService) {
    this.videoService.init().then(() => {
      this.ready = true;
      this.devices = this.videoService.devices.map((device: any, index: number) => ({index, label: device.label}));
    });
  }

  ngOnInit() {
    this.canvasService.init();
  }

  toggleStart() {
    if (this.initialized && !this.canvasService.running) {
      this.canvasService.running = true;
      this.canvasService.drawInterval(this.videoService ? this.videoService.leftVideo : null);
      this.canvasService.drawInterval(this.videoService ? this.videoService.rightVideo : null, false);
    } else {
      this.canvasService.running = false;
    }
  }

  init() {
    this.initialized = false;
    this.canvasService.running = false;
    this.videoService.initVideos(this.cameraLeftIndex, this.cameraRightIndex).then(() => this.initialized = true);
  }
}
