import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FilesService } from '../../services/files.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'download-page',
  templateUrl: './download-page.component.html'
})
export class DownloadPageComponent implements OnInit {
  fileId: string;

  constructor(private route: ActivatedRoute, private filesService: FilesService) {}

  ngOnInit(): void {
    this.fileId = this.route.snapshot.params['id'];
  }

  onDownload() {
    this.filesService.downloadFile(this.fileId).subscribe((data: ArrayBuffer) => {
      if (data) {
        const blob = new Blob([data]);
        saveAs(blob, this.fileId);
      }
    });
  }
}
