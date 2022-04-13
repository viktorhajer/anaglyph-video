import {Injectable} from '@angular/core';
import {VIDEO_HEIGHT, VIDEO_WIDTH} from '../constant';

@Injectable({
  providedIn: 'root'
})
export class CanvasService {

  running = false;

  private canvasLeft: HTMLCanvasElement | null = null;
  private contextLeft: CanvasRenderingContext2D | null = null;
  private canvasRight: HTMLCanvasElement | null = null;
  private contextRight: CanvasRenderingContext2D | null = null;

  init() {
    this.canvasLeft = document.getElementById('canvasLeft') as any;
    this.canvasRight = document.getElementById('canvasRight') as any;
    if (this.canvasLeft) {
      this.canvasLeft.width = VIDEO_WIDTH;
      this.canvasLeft.height = VIDEO_HEIGHT;
      this.contextLeft = this.canvasLeft.getContext('2d');
    }
    if (this.canvasRight) {
      this.canvasRight.width = VIDEO_WIDTH;
      this.canvasRight.height = VIDEO_HEIGHT;
      this.contextRight = this.canvasRight.getContext('2d');
    }
  }

  drawInterval(video: HTMLVideoElement | null, left = true) {
    if (this.running) {
      if (left) { // red
        if (!!this.contextLeft && !!this.canvasLeft && !!video) {
          this.contextLeft.drawImage(video, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
          this.setColor(this.canvasLeft, this.contextLeft, true, false, false);
          setTimeout(() => this.drawInterval(video, left));
        }
      } else {  // blue
        if (!!this.canvasRight && !!this.contextRight && !!video) {
          this.contextRight.drawImage(video, 0, 0, VIDEO_WIDTH, VIDEO_HEIGHT);
          this.setColor(this.canvasRight, this.contextRight, false);
          setTimeout(() => this.drawInterval(video, left));
        }
      }
    }
  }


  private setColor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D,
                   red = true, green = true, blue = true) {
    if (!!context && !!canvas) {
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const l = data.length / 4;
      for (let index = 0; index < l; index++) {
        data[index * 4 + 0] = red ? data[index * 4 + 0] : 0;
        data[index * 4 + 1] = green ? data[index * 4 + 1] : 0;
        data[index * 4 + 2] = blue ? data[index * 4 + 2] : 0;
      }
      context.putImageData(imageData, 0, 0);
    }
  }

  // this.context.globalCompositeOperation = "multiply";
  // // this.context.fillStyle = 'rgba(255, 0, 0, .45)';
  // this.context.fillStyle = 'rgba(0, 255, 255, 1)';
  // this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  // this.context.globalCompositeOperation = "source-over";
}
