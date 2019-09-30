import { Component, Input, OnInit } from '@angular/core';
import { HtmlElementInterface } from '../../services/html-elements.service';

@Component({
  selector: 'app-block-thumbnail',
  templateUrl: './block-thumbnail.component.html',
  styleUrls: ['./block-thumbnail.component.scss']
})
export class BlockThumbnailComponent implements OnInit{
  @Input() element: HtmlElementInterface;

  blockType: string;

  ngOnInit() {
    this.blockType = this.element.settings && this.element.settings.blockType || 'default';
  }
}
