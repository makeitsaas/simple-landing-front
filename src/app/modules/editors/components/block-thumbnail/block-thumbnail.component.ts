import { Component, Input, OnInit } from '@angular/core';
import { HtmlElementDataInterface } from '../../services/html-element-data.service';

@Component({
  selector: 'app-block-thumbnail',
  templateUrl: './block-thumbnail.component.html',
  styleUrls: ['./block-thumbnail.component.scss']
})
export class BlockThumbnailComponent implements OnInit{
  @Input() element: HtmlElementDataInterface;

  blockType: string;

  ngOnInit() {
    this.blockType = this.element.settings && this.element.settings.blockType || 'default';
  }
}
