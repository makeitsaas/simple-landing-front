import { Component, Input, OnInit } from '@angular/core';
import { MetaElement } from '../../entities/meta-element';

@Component({
  selector: 'app-block-thumbnail',
  templateUrl: './block-thumbnail.component.html',
  styleUrls: ['./block-thumbnail.component.scss']
})
export class BlockThumbnailComponent implements OnInit{
  @Input() element: MetaElement;

  blockType: string;

  ngOnInit() {
    this.blockType = this.element && this.element.data.settings && this.element.data.settings.blockType || 'default';
  }
}
