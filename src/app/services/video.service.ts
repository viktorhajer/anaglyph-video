import {Injectable} from '@angular/core';
import {VIDEO_HEIGHT, VIDEO_WIDTH} from '../constant';

@Injectable({
  providedIn: 'root'
})
export class VideoService {

  devices: any[] = [];
  leftVideo: HTMLVideoElement | null = null;
  rightVideo: HTMLVideoElement | null = null;

  init(): Promise<any> {
    return navigator.mediaDevices.getUserMedia({audio: true, video: true})
      .then(() => navigator.mediaDevices.enumerateDevices())
      .then(devices => devices.filter(d => d.kind === 'videoinput'))
      .then(devices => this.devices = devices);
  }

  initVideos(left: number, right: number): Promise<any> {
    return this.setVideo(this.devices[left]).then(v => {
      this.leftVideo = v;
      return this.setVideo(this.devices[right]);
    }).then(v => this.rightVideo = v);
  }

  private setVideo(device: any): Promise<HTMLVideoElement> {
    const constraint = {
      video: {
        deviceId: {exact: device.deviceId}
      }
    };
    return navigator.mediaDevices.getUserMedia(constraint)
      .then(stream => this.createVideo(stream));
  }

  private createVideo(stream: MediaStream): HTMLVideoElement {
    const video = document.createElement('video') as HTMLVideoElement;
    video.srcObject = stream;
    video.width = VIDEO_WIDTH;
    video.height = VIDEO_HEIGHT;
    video.autoplay = true;
    return video;
  }
}
