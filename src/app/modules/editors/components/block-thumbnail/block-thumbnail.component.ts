import { Component, Input, OnInit } from '@angular/core';
import { ElementDataInterface } from '../../entities/element-data';

@Component({
  selector: 'app-block-thumbnail',
  templateUrl: './block-thumbnail.component.html',
  styleUrls: ['./block-thumbnail.component.scss']
})
export class BlockThumbnailComponent implements OnInit{
  @Input() element: ElementDataInterface;

  blockType: string;

  ngOnInit() {
    this.blockType = this.element.settings && this.element.settings.blockType || 'default';
  }
}
