import { IPageLayers } from '../../services/element-data.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '@env';

export class AbstractEditor {
  pageId: string;
  layers: IPageLayers;
  stylesUrl: SafeResourceUrl[] = [];

  trustStyles(layers: IPageLayers, sanitizer: DomSanitizer): SafeResourceUrl[] {
    return layers.styles
      .filter(asset => asset.url)
      .map(asset => {
        let url = asset.url;
        if (/^\//.test(url)) {
          url = `${environment.APIUrl}${url}`;
        }
        console.log('trust', url);
        return sanitizer.bypassSecurityTrustResourceUrl(url);
      });
  }
}
